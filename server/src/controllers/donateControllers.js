import Donate from "../models/donate";
import Request from "../models/request";

export const createDonation = asyne (req, res, next) => {
    try {
        const requestId = req.params.id; // request id from url
        const donorId = req.user.id; // donor id form auth middleware

        // check if blood request exists
        const bloodRequest = await Request.findById(requesterId)
        if(!bloodRequest) {
            const error = new Error("This request is no longer available")
            error.statusCode = 404;
            return next(error)
        }

        // check if donor exists
        const donor = await User.findById(donorId)
        if(!donor) {
            const error = new Error("Donor not found. Please login again.")
            error.statusCode = 404;
            return next(error)
        }

        // check blood group is matched
        if(bloodRequest.bloodGroup !== donor.bloodGroup) {
            const error = new Error("Your blood group does not match the recipient's requirement.")
            error.status = 401
            return next(error)
        }


        if(bloodRequest.requester.toString() === donorId){
            const error = new Error("You cannot donate to your own request.");
            error.statusCode = 400;
            return next(error);
        }

        // check donor is available or not
       if(donor.lastDonationDate){
        const lastDate = new Date(donor.lastDonationDate)
        const today = new Date();
        const diffInTime = today.getTime() - lastDate.getTime();
        const diffInDays = Math.floor(diffInTime /  (1000*3600*24))
        if (diffInDays < 90) {
                const error = new Error(`You must wait ${90 - diffInDays} more days before donating again.`);
                error.statusCode = 400;
                return next(error);
            }
       }

    //    create a request
    const { message, estimatedArrival } = req.body;
       const donation = await Donate.create({
            requestId: requestId,
            donorId: donorId,
            status: "interested",
            message, estimatedArrival
        });

        bloodRequest.status = "inprogress"
        await bloodRequest.save();

       res.status(201).json({
            success: true,
            message: "Thank you! Your interest to donate has been recorded.",
            data: donation
        });


    } catch (error) {
        next(error)
    }
}