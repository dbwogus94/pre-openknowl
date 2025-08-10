import z from 'zod';

export const commonValidations = {
	id: z
		.string()
		.refine((data) => !Number.isNaN(Number(data)), 'ID must be a numeric value')
		.transform((data) => Number(data))
		.refine((num) => num > 0, 'ID must be a positive number string')
		.transform((num) => num.toString()),
	// ... other common validations
};
