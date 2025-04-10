import { z } from "zod";
import { initializeMcpApiHandler } from "../lib/mcp-api-handler";

const handler = initializeMcpApiHandler(
  (server) => {
    // Taxi booking service
    server.tool("call_taxi", {
      pickup: z.string().default("Shanghai Railway Station"),
      destination: z.string().default("Pudong Airport"),
      passengers: z.number().min(1).max(4).default(1),
      carType: z.enum(["economy", "comfort", "luxury"]).default("economy"),
      notes: z.string().optional()
    }, async ({ pickup, destination, passengers, carType, notes }) => ({
      content: [{ 
        type: "text", 
        text: `🚖 Ride Request #${Math.floor(Math.random() * 90000) + 10000} Confirmed

Driver Details:
- Name: Michael Chen
- Vehicle: ${carType === 'luxury' ? 'Mercedes-Benz S-Class' : carType === 'comfort' ? 'BMW 5 Series' : 'Toyota Camry'}
- License: SH ${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${Math.floor(Math.random() * 90000) + 10000}

Trip Details:
- Pickup: ${pickup}
- Destination: ${destination}
- Passengers: ${passengers}
- ETA to pickup: ${Math.floor(Math.random() * 4) + 2} minutes
${notes ? `- Special Instructions: ${notes}` : ''}

💰 Estimated Fare: ¥${Math.floor(Math.random() * 150) + 50}
📱 Track your ride in real-time through our app` 
      }],
    }));

    // Food ordering service
    server.tool("order_food", {
      restaurant: z.string().default("McDonald's"),
      items: z.array(z.object({
        name: z.string(),
        quantity: z.number().positive().default(1),
        specialRequests: z.string().optional()
      })).default([{ name: "Big Mac", quantity: 1 }]),
      address: z.string().default("123 Shanghai Tower, Lujiazui"),
      deliveryTime: z.string().default("ASAP"),
      contactPhone: z.string().optional()
    }, async ({ restaurant, items, address, deliveryTime, contactPhone }) => {
      const orderId = `${Math.floor(Math.random() * 90000) + 10000}`;
      const estimatedTime = Math.floor(Math.random() * 20) + 25;
      const subtotal = items.reduce((acc, item) => acc + (Math.floor(Math.random() * 30) + 20) * item.quantity, 0);
      const deliveryFee = Math.floor(Math.random() * 5) + 5;
      
      return {
        content: [{ 
          type: "text", 
          text: `🍽️ Order #${orderId} Confirmed

Restaurant: ${restaurant}
Status: Order Received ✅

Order Details:
${items.map(i => `• ${i.name} x${i.quantity}${i.specialRequests ? `\n  Note: ${i.specialRequests}` : ''}`).join('\n')}

Delivery Information:
📍 Address: ${address}
🕒 ${deliveryTime === 'ASAP' ? `Estimated Delivery: ${estimatedTime} mins` : `Scheduled Time: ${deliveryTime}`}
📱 Contact: ${contactPhone || 'N/A'}

Payment Summary:
Subtotal: ¥${subtotal}
Delivery Fee: ¥${deliveryFee}
Total: ¥${subtotal + deliveryFee}

🔄 Real-time order tracking available
💬 Your rider will message you upon pickup` 
        }],
      };
    });

    server.tool("echo", { message: z.string() }, async ({ message }) => ({
      content: [{ type: "text", text: `Tool echo: ${message}` }],
    }));
  },
  {
    capabilities: {
      tools: {
        call_taxi: {
          description: "Premium ride-hailing service with real-time tracking and professional drivers",
        },
        order_food: {
          description: "Full-service food delivery platform with live order tracking and secure payment",
        },
        echo: {
          description: "Echo a message",
        },
      },
    },
  }
);

export default handler;
