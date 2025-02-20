"use server";

import { doc } from "@/services/google-spreadsheet";
import type { ShippingAddressType } from "@/types/shipping-address";

export async function getShopifyID(sheet_Name: string, nft_Id: string) {
  await doc.loadInfo();
  const sheet = doc.sheetsByTitle[sheet_Name];
  const rows = await sheet.getRows();

  // Find the row with the matching NFT_ID
  const row = rows.find((row) => row.get("NFT_ID") === nft_Id);
  if (row) {
    // Return the Shopify ID
    return row.get("Shopify_ID");
  } else {
    // Handle case where NFT_ID is not found
    throw new Error(`NFT_ID ${nft_Id} not found in the sheet.`);
  }
}

export async function getProducts(id: string) {
  try {
    const response = await fetch(
      `${process.env.SHOPIFY_STORE_DOMAIN}/admin/api/2023-10/products.json`,
      {
        headers: {
          "X-Shopify-Access-Token": process.env.SHOPIFY_ACEESS_TOKEN || "",
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }

    const data = await response.json();
    const product = data["products"].filter((item: any) => item["id"] == id);
    return product[0];
  } catch (error) {
    return error;
  }
}

export async function createOrder(
  variantID: string,
  shippingAddress: ShippingAddressType
) {
  try {
    const response = await fetch(
      `${process.env.SHOPIFY_STORE_DOMAIN}/admin/api/2023-10/orders.json`,
      {
        method: "POST",
        headers: {
          "X-Shopify-Access-Token": process.env.SHOPIFY_ACEESS_TOKEN || "",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          order: {
            email: shippingAddress.email,
            line_items: [
              {
                variant_id: variantID,
                quantity: 1,
              },
            ],
            shipping_address: {
              first_name: shippingAddress.firstName,
              last_name: shippingAddress.lastName,
              address1: shippingAddress.address,
              city: shippingAddress.city,
              province: shippingAddress.state,
              country: shippingAddress.country,
              zip: shippingAddress.zipCode,
              phone: shippingAddress.phoneNumber,
            },
            discount_codes: [
              {
                code: "Black Box",
                amount: 100,
                type: "percentage",
              },
            ],
            send_receipt: true,
            financial_status: "paid",
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to create order");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    return error;
  }
}
