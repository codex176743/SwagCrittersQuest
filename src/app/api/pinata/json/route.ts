import { NextResponse, NextRequest } from "next/server";
import { pinata } from "@/services/pinata";

export const config = {
  api: {
    bodyParser: true,
  },
};

export async function POST(request: NextRequest) {
  try {
    const jsonData = await request.json();
    const upload = await pinata.upload.json(jsonData);
    const url = await pinata.gateways.convert(upload.IpfsHash);
    return NextResponse.json(url, { status: 200 });
  } catch (e) {
    console.log(e);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
