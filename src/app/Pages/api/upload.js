import { ref, getDownloadURL, uploadBytes } from "firebase/storage";
import { storage } from "@/app/firebase";

export const config = {
  api: {
    bodyParser: false, // we will use formidable to handle file uploads
  },
};

import formidable from "formidable";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const form = new formidable.IncomingForm();
  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).json({ message: err.message });

    try {
      const file = files.file;
      const buffer = await fs.promises.readFile(file.filepath);

      const imageRef = ref(storage, `products/${Date.now()}-${file.originalFilename}`);
      await uploadBytes(imageRef, buffer);

      const url = await getDownloadURL(imageRef);
      res.status(200).json({ url });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
}
