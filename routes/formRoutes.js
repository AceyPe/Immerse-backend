import express from 'express'
import {
    formSubmit,
    getFearFormById,
    getFearFormsByTherapistId,
    getParentFormById,
    getParentFormsByTherapistId
} from '../controllers/formController.js'

const router = express.Router();

router.post("/form", formSubmit);
router.get("/form/fear/:id", getFearFormById);
router.get("/form/fear/therapist/:id", getFearFormsByTherapistId);
router.get("/form/parent/:id", getParentFormById);
router.get("/form/parent/therapist/:id", getParentFormsByTherapistId);


export default router;