import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

function App() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleFiles = (e) => {
    const files = Array.from(e.target.files).map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      id: uuidv4(),
    }));

    setImages((prev) => [...prev, ...files]);
  };

  const removeImage = (id) => {
    setImages((prev) => {
      const updated = prev.filter((img) => {
        if (img.id === id) {
          URL.revokeObjectURL(img.preview); // cleanup
          return false;
        }
        return true;
      });
      return updated;
    });
  };

  const onDragStart = (e, index) => {
    e.dataTransfer.setData("index", index);
  };

  const onDrop = (e, index) => {
    e.preventDefault();
    const fromIndex = Number(e.dataTransfer.getData("index"));

    if (fromIndex === index) return;

    setImages((prev) => {
      const items = [...prev];
      const [moved] = items.splice(fromIndex, 1);
      items.splice(index, 0, moved);
      return items;
    });
  };

  const convertToPDF = async () => {
    if (images.length === 0) {
      alert("No Image Selected");
      return;
    }

    const formData = new FormData();
    images.forEach((img) => formData.append("files", img.file));

    try {
      setLoading(true);

      const res = await fetch("/img2pdf", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to convert");

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "images.pdf";
      a.click();

      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("Error converting images");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* HEADER */}
      <header className="text-center bg-gray-800 rounded-md py-10 border-b border-gray-300">
        <h1 className="text-4xl text-white font-bold">Image to PDF</h1>
        <p className="text-gray-100 mt-2">Convert your images into A4 PDF</p>
      </header>

      {/* MAIN */}
      <main className="flex flex-col items-center flex-1 px-10 py-8">
        {/* Upload */}
        <label className="border-2 border-dashed border-gray-300 rounded-lg px-6 py-3 text-gray-600 cursor-pointer hover:bg-blue-800 mb-8">
          Select Images
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFiles}
            hidden
          />
        </label>

        {/* Grid */}
        <div className="grid grid-cols-4 gap-6 w-full max-w-6xl">
          {images.map((img, index) => (
            <div
              key={img.id}
              className="bg-white border border-gray-300 rounded-lg overflow-hidden relative"
              draggable
              onDragStart={(e) => onDragStart(e, index)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => onDrop(e, index)}
            >
              <img
                className="w-full h-44 object-cover"
                src={img.preview}
                alt=""
              />

              {/* Delete */}
              <button
                onClick={() => removeImage(img.id)}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
              >
                ×
              </button>

              <div className="flex justify-between items-center px-3 py-2 text-gray-600 text-sm">
                <span>Page {index + 1}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Convert */}
        <button
          onClick={convertToPDF}
          disabled={loading}
          className="mt-10 px-8 py-3 bg-gray-900 cursor-pointer text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
        >
          {loading ? "Converting..." : "Download PDF"}
        </button>
      </main>

      {/* FOOTER */}
      <footer className="text-center py-6 border-t border-gray-300 text-gray-600">
        © 2026 Image to PDF Converter
      </footer>
    </div>
  );
}

export default App;
