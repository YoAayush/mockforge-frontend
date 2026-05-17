import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

// const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
const BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}`;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function mainHandler(
  req: Request,
  context: { params: Promise<{ project: string; slug: string[] }> },
) {
  // console.log(req.headers.get("authorization"));
  const { project, slug } = await context.params;
  // console.log("Received request for project:", project, "slug:", slug);

  const BearerToken = req.headers.get("authorization");

  if (!BearerToken) {
    return { error: "Missing Authorization header" };
  }

  const method = req.method;
  // console.log("HTTP method:", method);

  const slugArray = Array.isArray(slug) ? slug : [];
  const schemaName = slugArray[0];
  const id = slugArray[1];
  // console.log("Schema name:", schemaName, "ID:", id);

  if (!project || !schemaName) {
    return { error: "Missing project or schemaName in the URL" };
  }

  const url = id
    ? `${BASE_URL}/mock/${project}/${schemaName}/${id}`
    : `${BASE_URL}/mock/${project}/${schemaName}`;

  try {
    switch (method) {
      case "GET": {
        const res = await axios.get(url, {
          headers: {
            Authorization: BearerToken,
          },
        });
        return { data: res.data, status: res.status };
      }

      case "POST": {
        const body = await req.json();
        const res = await axios.post(url, body, {
          headers: {
            Authorization: BearerToken,
          },
        });
        return { data: res.data, status: res.status };
      }

      case "PATCH": {
        const body = await req.json();
        const res = await axios.patch(url, body, {
          headers: {
            Authorization: BearerToken,
          },
        });
        return { data: res.data, status: res.status };
      }

      case "DELETE": {
        const res = await axios.delete(url, {
          headers: {
            Authorization: BearerToken,
          },
        });
        return { data: res.data, status: res.status };
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

// ✅ Handle Preflight Request (VERY IMPORTANT)
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders,
  });
}

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ project: string; slug: string[] }> },
) {
  const data = await mainHandler(req, context);
  return NextResponse.json({ data }, { headers: corsHeaders });
}

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ project: string; slug: string[] }> },
) {
  const data = await mainHandler(req, context);
  return NextResponse.json({ data }, { headers: corsHeaders });
}

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ project: string; slug: string[] }> },
) {
  const data = await mainHandler(req, context);
  return NextResponse.json({ data }, { headers: corsHeaders });
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ project: string; slug: string[] }> },
) {
  const data = await mainHandler(req, context);
  return NextResponse.json({ data }, { headers: corsHeaders });
}
