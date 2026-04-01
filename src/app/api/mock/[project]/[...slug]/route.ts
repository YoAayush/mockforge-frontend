import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

// const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
const BASE_URL = "http://localhost:3000/api/v1";

export async function mainHandler(
  req: Request,
  context: { params: Promise<{ project: string; slug: string[] }> },
) {
  const { project, slug } = await context.params;
  console.log("Received request for project:", project, "slug:", slug);

  const method = req.method;
  console.log("HTTP method:", method);

  const slugArray = Array.isArray(slug) ? slug : [];
  const schemaName = slugArray[0];
  const id = slugArray[1];
  console.log("Schema name:", schemaName, "ID:", id);

  if (!project || !schemaName) {
    return { error: "Missing project or schemaName in the URL" };
  }

  const url = id
    ? `${BASE_URL}/mock/${project}/${schemaName}/${id}`
    : `${BASE_URL}/mock/${project}/${schemaName}`;

  try {
    switch (method) {
      case "GET": {
        const res = await axios.get(url);
        return res.data;
      }

      case "POST": {
        const body = await req.json();
        const res = await axios.post(url, body);
        return res.data;
      }

      case "PATCH": {
        const body = await req.json();
        const res = await axios.patch(url, body);
        return res.data;
      }

      case "DELETE": {
        const res = await axios.delete(url);
        return res.data;
      }

      default:
        return { error: "Method not allowed" };
    }
  } catch (error: any) {
    return {
      error: error.response?.data || error.message,
      status: error.response?.status || 500,
    };
  }
}

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ project: string; slug: string[] }> },
) {
  const data = await mainHandler(req, context);
  return NextResponse.json({ data });
}

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ project: string; slug: string[] }> },
) {
  const data = await mainHandler(req, context);
  return NextResponse.json({ data });
}

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ project: string; slug: string[] }> },
) {
  const data = await mainHandler(req, context);
  return NextResponse.json({ data });
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ project: string; slug: string[] }> },
) {
  const data = await mainHandler(req, context);
  return NextResponse.json({ data });
}
