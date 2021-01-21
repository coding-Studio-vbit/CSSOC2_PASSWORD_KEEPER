const express = require("express")
const router = express.Router()

/*

	Check the details, If they match, CREATE A TOKEN and send it as the response.
	Get the authorization header from the request.
	Decrypt the token, attach the user object to the request

*/

router.post("/login", (req, res)=>{
	
})

module.exports = router
