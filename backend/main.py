from fastapi import FastAPI, File, UploadFile
from fastapi.responses import StreamingResponse
from typing import List
import img2pdf
import tempfile
import os
import io

app = FastAPI()

# A4 size in points (correct PDF unit)
A4_SIZE = (img2pdf.mm_to_pt(210), img2pdf.mm_to_pt(297))


@app.post("/img2pdf")
async def img_to_pdf(files: List[UploadFile] = File(...)):

    temp_files = []

    try:
        # 1. Stream upload → disk (no RAM usage)
        for f in files:
            suffix = os.path.splitext(f.filename)[-1] or ".img"

            tmp = tempfile.NamedTemporaryFile(delete=False, suffix=suffix)
            temp_files.append(tmp.name)

            with open(tmp.name, "wb") as out:
                while chunk := await f.read(1024 * 1024):
                    out.write(chunk)

        # 2. Convert with A4 layout (RESTORED)
        pdf_bytes = img2pdf.convert(
            temp_files,
            layout_fun=img2pdf.get_layout_fun(
                pagesize=A4_SIZE,
                fit=img2pdf.FitMode.into
            )
        )

        # 3. Stream response
        return StreamingResponse(
            io.BytesIO(pdf_bytes),
            media_type="application/pdf",
            headers={
                "Content-Disposition": "attachment; filename=images.pdf"
            },
        )

    finally:
        # 4. Cleanup temp files
        for path in temp_files:
            try:
                if os.path.exists(path):
                    os.remove(path)
            except:
                pass
