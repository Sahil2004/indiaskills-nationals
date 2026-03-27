import multer from "multer"

const storage = multer.diskStorage({
    destination: "uploads/",
    filename: (req, f, cb) => {
        cb(null, Date.now() + '-' + f.originalname);
    }
})

export const upload = multer({ storage })