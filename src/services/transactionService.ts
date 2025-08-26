import { group } from "node:console";
import * as groupRepositories from "../repositories/groupRepositories";
import * as transactionRepositories from "../repositories/transactionRepositories";
import * as userRepositories from "../repositories/userRepositories";
import { WithdrawValues } from "../utils/schema/transaction";

export const createTransaction = async (groupId: string, userId: string) => {
  const checkMember = await groupRepositories.getMemberById(userId, groupId);

  if (checkMember) {
    throw new Error("You already join group");
  }

  const group = await groupRepositories.findGroupById(groupId);

  if (group.type === "FREE") {
    throw new Error("This group is free");
  }

  const user = await userRepositories.getUserById(userId);

  const transaction = await transactionRepositories.createTransaction({
    price: group.price,
    owner: {
      connect: {
        id: group.room.RoomMember[0].userId,
      },
    },
    User: {
      connect: {
        id: userId,
      },
    },
    type: "PENDING",
    group: {
      connect: {
        id: group.id,
      },
    },
  });

  const midtransUrl = process.env.MIDTRANS_TRANSACTION_URL ?? "";
  const midtransAuth = process.env.MIDTRANS_AUTH_STRING ?? "";

  const midtransResponse = await fetch(midtransUrl, {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: `Basic ${midtransAuth}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      transaction_details: {
        order_id: transaction.id,
        gross_amount: transaction.price,
      },
      credit_card: {
        secure: true,
      },
      customer_details: {
        email: user.email,
      },
    }),
  });

  const midtransJson = await midtransResponse.json();

  return midtransJson;
};

export const updateTransaction = async (order_id: string, status: string) => {
  switch (status) {
    case "capture":
    case "settlement": {
      const transaction = await transactionRepositories.updateTransaction(
        order_id,
        "SUCCESS"
      );
      const group = await groupRepositories.findGroupById(transaction.groupId);

      await groupRepositories.addMemberToGroup(
        group.roomId,
        transaction.userId
      );

      return {
        transaction_id: transaction.id,
      };
    }

    case "deny":
    case "expire":
    case "failure": {
      const transaction = await transactionRepositories.updateTransaction(
        order_id,
        "FAILED"
      );

      return {
        transaction_id: transaction.id,
      };
    }

    default:
      return {};
  }
};

export const getBalance = async (userId: string) => {
  const transactions = await transactionRepositories.getMyTransactions(userId);
  const payouts = await transactionRepositories.getMyPayouts(userId);

  const totalRevenue = transactions.reduce((acc, curr) => {
    if (curr.type === "SUCCESS") {
      return acc + curr.price;
    }

    return acc;
  }, 0);

  const totalPayouts = payouts.reduce((acc, curr) => acc + curr.amount, 0);

  return totalRevenue - totalPayouts;
};

export const getRevenueStat = async (userId: string) => {
  const transactions = await transactionRepositories.getMyTransactions(userId);
  const payouts = await transactionRepositories.getMyPayouts(userId);
  const groups = await groupRepositories.getMyOwnGroups(userId);

  const totalRevenue = transactions.reduce((acc, curr) => {
    if (curr.type === "SUCCESS") {
      return acc + curr.price;
    }

    return acc;
  }, 0);

  const totalPayouts = payouts.reduce((acc, curr) => acc + curr.amount, 0);

  const balance = totalRevenue - totalPayouts;

  const totalVipGroups = groups.filter((group) => group.type === "PAID").length;
  const totalVipMembers = groups.reduce((acc, curr) => {
    if (curr.type === "PAID") {
      return acc + (curr?.room?._count?.RoomMember ?? 0);
    }

    return acc;
  }, 0);

  const latestMembersVip = transactions.filter(
    (transaction) => transaction.type === "SUCCESS"
  );

  return {
    balance,
    totalVipGroups: totalVipGroups,
    totalVipMembers: totalVipMembers,
    totalRevenue: totalRevenue,
    latestMembersVip: latestMembersVip,
  };
};

export const getHistoryPayouts = async (userId: string) => {
  return await transactionRepositories.getMyPayouts(userId);
};

export const createWithdraw = async (data: WithdrawValues, userId: string) => {
  const balance = await getBalance(userId);

  if (balance < data.amount) {
    throw new Error("Failed to create withdraw: Insufficient balance");
  }

  return await transactionRepositories.createWithdraw(data, userId);
};
