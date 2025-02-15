import { z } from 'zod'


export const userSchema = z.object({
    full_name: z.string(),
    email: z.string(),
    contact_phone: z.string(),
    address: z.string(),
    role: z.string().optional(),
    created_at: z.string().refine((val) => !isNaN(Date.parse(val)), {
        message: 'Invalid date format for created_at',
    }).transform((val) => new Date(val)).optional(),
    updated_at: z.string().refine((val) => !isNaN(Date.parse(val)), {
        message: 'Invalid date format for updated_at',
    }).transform((val) => new Date(val)).optional()
})


export const registerSchema = z.object({
    full_name: z.string(),
    email: z.string().email(),
    contact_phone: z.string(),
    address: z.string(),
    role: z.string().optional(),
    created_at: z.string().refine((val) => !isNaN(Date.parse(val)), {
        message: 'Invalid date format for created_at',
    }).transform((val) => new Date(val)).optional().optional(),
    updated_at: z.string().refine((val) => !isNaN(Date.parse(val)), {
        message: 'Invalid date format for updated_at',
    }).transform((val) => new Date(val)).optional().optional(),
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
    }).transform((val) => new Date(val)).optional(),
    updated_at: z.string().refine((val) => !isNaN(Date.parse(val)), {
        message: 'Invalid date format for updated_at',
    }).transform((val) => new Date(val)).optional()
})

export const vehicleSpecsSchema = z.object({
    manufacturer: z.string(),
    vehicle_type: z.string(),
    model: z.string(),
    year: z.number(),
    fuel_type: z.string(),
    engine_capacity: z.string(),
    transmission: z.string(),
    seating_capacity: z.number(),
    color: z.string(),
    features: z.string()
})

export const bookingSchema = z.object({
    user_id: z.number(),
    vehicle_id: z.number(),
    location_id: z.number(),
    booking_date: z.string().refine((val) => !isNaN(Date.parse(val)), {
        message: 'Invalid date format for booking date',
    }).transform((val) => new Date(val)).optional(),
    return_date: z.string().refine((val) => !isNaN(Date.parse(val)), {
        message: 'Invalid date format for booking date',
    }).transform((val) => new Date(val)).optional(),
    total_amount: z.number(),
    booking_status: z.string(),
    created_at: z.string().refine((val) => !isNaN(Date.parse(val)), {
        message: 'Invalid date format for created_at',
    }).transform((val) => new Date(val)).optional(),
    updated_at: z.string().refine((val) => !isNaN(Date.parse(val)), {
        message: 'Invalid date format for updated_at',
    }).transform((val) => new Date(val)).optional()
})

export const paymentSchema = z.object({
    payment_id: z.number(),
    booking_id: z.number(),
    amount: z.number(),
    payment_status: z.string(),
    payment_date: z.string().refine((val) => !isNaN(Date.parse(val)), {
        message: 'Invalid date format for payment date',
    }).transform((val) => new Date(val)).optional(),
    payment_method: z.string(),
    transaction_id: z.string(),
    created_at: z.string().refine((val) => !isNaN(Date.parse(val)), {
        message: 'Invalid date format for created_at',
    }).transform((val) => new Date(val)).optional(),
    updated_at: z.string().refine((val) => !isNaN(Date.parse(val)), {
        message: 'Invalid date format for updated_at',
    }).transform((val) => new Date(val)).optional()
})

export const supportTicketSchema = z.object({
    user_id: z.number(),
    subject: z.string(),
    description: z.string(),
    status: z.string(),
    created_at: z.string().refine((val) => !isNaN(Date.parse(val)), {
        message: 'Invalid date format for created_at',
    }).transform((val) => new Date(val)).optional(),
    updated_at: z.string().refine((val) => !isNaN(Date.parse(val)), {
        message: 'Invalid date format for updated_at',
    }).transform((val) => new Date(val)).optional()
})

export const locationSchema = z.object({
    name: z.string(),
    address: z.string(),
    created_at: z.string().refine((val) => !isNaN(Date.parse(val)), {
        message: 'Invalid date format for created_at',
    }).transform((val) => new Date(val)).optional().optional(),
    updated_at: z.string().refine((val) => !isNaN(Date.parse(val)), {
        message: 'Invalid date format for updated_at',
    }).transform((val) => new Date(val)).optional().optional()
    
})

export const branchSchema = z.object({
    name: z.string(),
    location_id: z.number(),
    contact_phone: z.string(),
    created_at: z.string().refine((val) => !isNaN(Date.parse(val)), {
        message: 'Invalid date format for created_at',
    }).transform((val) => new Date(val)).optional(),
    updated_at: z.string().refine((val) => !isNaN(Date.parse(val)), {
        message: 'Invalid date format for updated_at',
    }).transform((val) => new Date(val)).optional()
})

export const fleetSchema = z.object({
    vehicle_id: z.number(),
    acquisition_date: z.string().refine((val) => !isNaN(Date.parse(val)), {
        message: 'Invalid date format for created_at',
    }).transform((val) => new Date(val)).optional(),
    depreciation_rate: z.number(),
    current_value: z.number(),
    maintenance_cost: z.number(),
    status: z.string(),
    created_at: z.string().refine((val) => !isNaN(Date.parse(val)), {
        message: 'Invalid date format for created_at',
    }).transform((val) => new Date(val)).optional(),
    updated_at: z.string().refine((val) => !isNaN(Date.parse(val)), {
        message: 'Invalid date format for updated_at',
    }).transform((val) => new Date(val)).optional()
})