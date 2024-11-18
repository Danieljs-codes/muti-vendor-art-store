import { queryOptions } from "@tanstack/react-query";
import { Paystack } from "paystack-sdk";

export const paystack = new Paystack(process.env.PAYSTACK_SECRET_KEY as string);

type Banks = {
	status: boolean;
	message: string;
	data: {
		id: number;
		name: string;
		slug: string;
		code: string;
		longcode: string;
		gateway: string;
		pay_with_bank: boolean;
		supports_transfer: boolean;
		active: boolean;
		country: string;
		currency: string;
		type: string;
		is_deleted: boolean;
		createdAt: string;
		updatedAt: string;
	}[];
};

export const getBanksQueryOptions = () =>
	queryOptions({
		queryKey: ["get-banks"],
		queryFn: async () => {
			const res = await fetch("https://api.paystack.co/bank");
			const data = (await res.json()) as Banks;
			return data.data;
		},
	});
