import { NextResponse } from "next/server";
import { StaticOptionsService, VALID_CATEGORIES, ValidCategory } from "@/lib/staticOptionsService";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    
    if (!category) {
      return NextResponse.json(
        { message: "Category parameter is required" },
        { status: 400 }
      );
    }

    // Validate category parameter
    const validCategories = Object.values(VALID_CATEGORIES);
    if (!validCategories.includes(category as ValidCategory)) {
      return NextResponse.json(
        { message: `Invalid category. Must be one of: ${validCategories.join(', ')}` },
        { status: 400 }
      );
    }

    const options = await StaticOptionsService.getActiveOptions(category as ValidCategory);
    
    return NextResponse.json({ options });
  } catch (error: any) {
    console.error("STATIC_OPTIONS_GET_ERROR", error);
    return NextResponse.json(
      { message: "Failed to fetch static options" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { optionId, newValue, changeReason } = body;
    
    if (!optionId || !newValue || !changeReason) {
      return NextResponse.json(
        { message: "optionId, newValue, and changeReason are required" },
        { status: 400 }
      );
    }

    const updatedOption = await StaticOptionsService.updateOptionText(
      optionId, 
      newValue, 
      changeReason
    );
    
    return NextResponse.json({ option: updatedOption });
  } catch (error: any) {
    console.error("STATIC_OPTIONS_UPDATE_ERROR", error);
    return NextResponse.json(
      { message: error.message || "Failed to update static option" },
      { status: 500 }
    );
  }
}
