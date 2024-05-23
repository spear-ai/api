import { NextResponse } from "next/server";
import { ruruHTML } from "ruru/server";

export const GET = () =>
  new NextResponse(ruruHTML({ endpoint: `/api/graphql` }), {
    headers: { "Content-Type": "text/html" },
    status: 200,
  });
