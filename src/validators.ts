import { z } from 'zod'


export const userSchema = z.object({
    full_name: z.string(),
    email: z.string(),
    contact_phone: z.string(),
    address: z.string(),
    role: z.string().optional(),
    created_at: z.string().refine((val) => !isNaN(Date.parse(val)), {
        message: 'Invalid date format for created_at',
    }).transform((val) => new Date(val)),
    updated_at: z.string().refine((val) => !isNaN(Date.parse(val)), {
        message: 'Invalid date format for updated_at',
    }).transform((val) => new Date(val))
})


export const registerSchema = z.object({
    full_name: z.string(),
    email: z.string().email(),
    contact_phone: z.string(),
    address: z.string(),
    role: z.string().optional(),
    created_at: z.string().refine((val) => !isNaN(Date.parse(val)), {
        message: 'Invalid date format for created_at',
    }).transform((val) => new Date(val)),
    updated_at: z.string().refine((val) => !isNaN(Date.parse(val)), {
        message: 'Invalid date format for updated_at',
    }).transform((val) => new Date(val)),
    password: z.string()
});

export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string()
})

export const vehicleSchema = z.object({
    vehicle_specs_id: z.number(),
    rental_rate: z.number(),
    availability: z.boolean(),
    created_at: z.string().refine((val) => !isNaN(Date.parse(val)), {
        message: 'Invalid date format for created_at',
    }).transform((val) => new Date(val)),
    updated_at: z.string().refine((val) => !isNaN(Date.parse(val)), {
        message: 'Invalid date format for updated_at',
    }).transform((val) => new Date(val))
})

export const vehicleSpecsSchema = z.object({
    manufacturer: z.string(),
    model: z.string(),
    year: z.number(),
    fuel_type: z.string(),
    engine_capacity: z.string(),
    transmission: z.string(),
    seating_capacity: z.number(),
    color: z.string(),
    features: z.string()
})