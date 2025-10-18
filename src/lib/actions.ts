"use server";

import * as z from "zod";

const formSchema = z.union([
  z.object({
    type: z.literal("contact"),
    name: z.string(),
    email: z.string().email(),
    message: z.string(),
  }),
  z.object({
    type: z.literal("order"),
    name: z.string(),
    company: z.string().optional(),
    phone: z.string(),
    email: z.string().email(),
    riceType: z.string(),
    quantity: z.string(),
    message: z.string().optional(),
  }),
]);

export async function submitForm(data: z.infer<typeof formSchema>) {
  try {
    const parsedData = formSchema.parse(data);

    // Simulate sending an email or saving to a database
    console.log("Form submission received:", parsedData);

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In a real application, you would integrate with an email service
    // like SendGrid, Resend, or store the data in a database.
    
    if (parsedData.type === 'contact') {
        console.log(`Simulating sending contact email from ${parsedData.email}`);
    } else if (parsedData.type === 'order') {
        console.log(`Simulating sending order inquiry from ${parsedData.email} for ${parsedData.quantity}kg of ${parsedData.riceType}`);
    }
    
    return { success: true, message: "Form submitted successfully." };
  } catch (error) {
    console.error("Form submission error:", error);
    if (error instanceof z.ZodError) {
      return { success: false, message: "Invalid form data.", errors: error.errors };
    }
    return { success: false, message: "An unexpected error occurred. Please try again." };
  }
}
