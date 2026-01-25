from fastapi import FastAPI, File, UploadFile
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from typing import List
import img2pdf
import io

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*" ],
    allow_methods=["*"],
    allow_headers=["*"],
)

A4_SIZE = (img2pdf.mm_to_pt(210), img2pdf.mm_to_pt(297))

@app.post("/img2pdf")
async def img_to_pdf(files: List[UploadFile] = File(...)):
    images = [await f.read() for f in files]

    pdf_bytes = img2pdf.convert(
        images,
        layout_fun=img2pdf.get_layout_fun(
            pagesize=A4_SIZE,
            fit=img2pdf.FitMode.into
        )
    )

    return StreamingResponse(
        io.BytesIO(pdf_bytes),
        media_type="application/pdf",
        headers={"Content-Disposition": "attachment; filename=images.pdf"},
    )
