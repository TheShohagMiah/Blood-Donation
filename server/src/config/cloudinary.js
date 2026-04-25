import { v2 as cloudinary } from "cloudinary";
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
});

export const uploadToCloudinary = async (filePath) => {
  try {
    if (!filePath) {
      throw new Error("File path is required");
    }
    const result = await cloudinary.uploader.upload(filePath);
    return result;
  } catch (error) {
    return { error: error.message };
  }
};

export const deleteFromCloudinary = async (urlOrPublicId) => {
  try {
    // Accept either a full Cloudinary URL or a bare public_id
    let publicId = urlOrPublicId;

    if (urlOrPublicId.startsWith("http")) {
      const url = new URL(urlOrPublicId);
      const parts = url.pathname.split("/");
      const uploadIndex = parts.indexOf("upload");
      const withoutVersion = parts.slice(uploadIndex + 2).join("/");
      publicId = withoutVersion.replace(/\.[^/.]+$/, "");
    }

    const result = await cloudinary.uploader.destroy(publicId);

    if (result.result !== "ok") {
      return { error: `Cloudinary deletion failed: ${result.result}` };
    }

    return { success: true, publicId };
  } catch (err) {
    return { error: err.message };
  }
};
export default cloudinary;
