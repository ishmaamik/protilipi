import { NextResponse } from "next/server";
import pdf from "pdf-parse";
import fs from 'fs';
import path from 'path';

export const POST = async (request) => {
  try {
    // If no file is uploaded, return a default response
    return NextResponse.json({ 
      text: "No PDF file was uploaded or processed.", 
      status: 200 
    });
  } catch (error) {
    console.error("Error in PDF parsing route:", error);
    return NextResponse.json(
      { error: "Failed to process the request." },
      { status: 500 }
    );
  }
};
