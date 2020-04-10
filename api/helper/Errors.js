"use strict";
exports.errors = {
	"invalid_parameters" 										: [100, "Invalid Parameters."],
	"server_error"		 										: [500, "Something went wrong"],
	"otp_error"			 										: [300, "OTP submitted is invaid."],
	"profile_not_found"											: [400, "Profile was not found."],
	"phone_number_not_found"									: [500, "Phone number was not found."],
	"profile_already_exists"									: [600, "Profile already exists."],
    "account_not_verified"										: [700, "Account not verified yet."],
    "no_server_response"										: [2300,"No response from server."],
};