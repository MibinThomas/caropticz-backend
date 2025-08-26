import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import transporter from "../config/emailConfig.js";
// import Address from "../models/Address.js";
import config from "../config/env.js";

const authController = {
  register: async (req, res) => {
    const { name, email, password } = req.body;

    try {
      const existingUser = await User.findOne({ email });

      if (existingUser && existingUser.isVerified) {
        return res.status(400).json({ message: "User already exists!!" });
      }

      // Generate OTP
      const otp = Math.floor(1000 + Math.random() * 9000);
      const otpExpireAt = new Date(Date.now() + 5 * 60 * 1000); // 5 mins

      const hashedPassword = await bcrypt.hash(password, 10);

      // Create new user (unverified)
      const newUser = new User({
        name,
        email,
        password: hashedPassword,
        role: "user",
        otp,
        otpExpireAt,
        isVerified: false,
      });

      await newUser.save();

      // Send OTP email
      await transporter.sendMail({
        from: config.EMAIL,
        to: email,
        subject: "Verify Your Email",
        text: `Your OTP is ${otp}. It expires in 5 minutes.`,
      });

      return res.status(201).json({
        message: "OTP sent to your email. Please verify.",
        userId: newUser._id,
      });
    } catch (error) {
      console.error("Registration error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },

  registerOtpVerify: async (req, res) => {
    try {
      const { email, otp } = req.body;
      const userDetails = await User.findOne({ email });

      if (!userDetails) {
        return res.status(404).json({ message: "Email not found" });
      }

      if (!userDetails.otpExpireAt || new Date() > userDetails.otpExpireAt) {
        return res.status(400).json({ message: "OTP has expired" });
      }

      if (userDetails.otp === Number(otp)) {
        userDetails.isVerified = true;
        userDetails.otp = null;
        userDetails.otpExpireAt = null;
        await userDetails.save();

        return res.status(200).json({ message: "OTP verified successfully" });
      } else {
        return res.status(400).json({ message: "Invalid OTP" });
      }
    } catch (error) {
      res
        .status(500)
        .json({ error: "Internal Server Error", message: error.message });
    }
  },

  login: async (req, res) => {
    const { email, password } = req.body;

    try {
      const existingUser = await User.findOne({ email });
      if (!existingUser) {
        return res
          .status(404)
          .json({ message: "Account does not exist... Please register!" });
      }

      if (!existingUser.isVerified) {
        return res.status(403).json({
          message: "Please verify your email with OTP before logging in.",
        });
      }

      const isPasswordValid = await bcrypt.compare(
        password,
        existingUser.password
      );
      if (!isPasswordValid) {
        return res.status(400).json({ message: "Invalid password!" });
      }

      // Generate JWT token
      let token;
      if (existingUser.role === "admin") {
        token = jwt.sign(
          { userId: existingUser._id },
          config.JWT_ADMIN_SECRET_KEY,
          { expiresIn: "1h" }
        );
      } else {
        token = jwt.sign({ userId: existingUser._id }, config.JWT_SECRET_KEY, {
          expiresIn: "1h",
        });
      }

      return res.status(200).json({
        message: "Login successful",
        user: {
          _id: existingUser._id,
          name: existingUser.name,
          email: existingUser.email,
          role: existingUser.role,
        },
        token,
      });
    } catch (error) {
      console.error("Login error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },

  //forgot password

  forgotPassword: async (req, res) => {
    console.log("Inside forgot password");

    try {
      const { email } = req.body;
      const verifiedUser = await User.findOne({ email });

      if (!verifiedUser) {
        return res
          .status(404)
          .json({ message: "Account does not exist... Please register!" });
      }

      // Generate OTP
      const otp = Math.floor(1000 + Math.random() * 9000);

      // Define email options
      const mailOptions = {
        from: config.EMAIL,
        to: email,
        subject: "OTP Verification",
        text: `Your OTP is ${otp}`,
      };

      // Send email
      await transporter.sendMail(mailOptions);

      // Save OTP & expiry
      verifiedUser.otp = otp;
      verifiedUser.otpExpireAt = new Date(Date.now() + 2 * 60 * 1000);
      await verifiedUser.save();

      return res.status(200).json({ message: "OTP sent successfully" });
    } catch (error) {
      console.error("Error in forgotPassword:", error);
      return res.status(500).json({ message: "Internal server error", error });
    }
  },

  // verify otp
  verifyOtp: async (req, res) => {
    try {
      const { email, otp } = req.body;

      console.log(email, otp);

      const userDetails = await User.findOne({ email });
      console.log(userDetails);

      if (!email) {
        return res.status(404).json({ message: "Email not found" });
      }

      // Check if OTP has expired
      if (!userDetails.otpExpireAt || new Date() > userDetails.otpExpireAt) {
        return res.status(400).json({ message: "OTP has expired" });
      }

      // verify otp
      if (userDetails.otp === Number(otp)) {
        res.status(200).json({ message: "OTP verified successfully" });
        console.log(userDetails.otp);
      } else {
        res.status(400).json({ message: "Invalid OTP" });
      }
    } catch (error) {
      res
        .status(500)
        .json({ error: "Internal Server Error", message: error.message });
    }
  },

  // Reset Password
  resetPassword: async (req, res) => {
    const { email, password, confirmPassword } = req.body;
    try {
      // Validate password match
      if (password !== confirmPassword) {
        return res.status(400).json({ message: "Passwords do not match" });
      }
      // Check if user exists
      const verifiedUser = await User.findOne({ email });
      if (!verifiedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      // Hash the new password
      const hashedPassword = await bcrypt.hash(password, 10);
      // Update the user's password and clear OTP fields if any
      verifiedUser.password = hashedPassword;
      verifiedUser.otp = null;
      verifiedUser.otpExpireAt = null;
      await verifiedUser.save();
      return res.status(200).json({ message: "Password changed successfully" });
    } catch (error) {
      return res.status(500).json({ message: "Internal server error", error });
    }
  },

  resendOtp: async (req, res) => {
    try {
      const { email, purpose } = req.body;
      // purpose can be "register" or "reset"

      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Condition for registration
      if (purpose === "register" && user.isVerified) {
        return res.status(400).json({ message: "User already verified" });
      }

      // Condition for password reset
      if (purpose === "reset" && !user.isVerified) {
        return res.status(400).json({ message: "User is not verified yet" });
      }

      // Generate new OTP
      const otp = Math.floor(1000 + Math.random() * 9000);
      const otpExpireAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

      // Update OTP
      user.otp = otp;
      user.otpExpireAt = otpExpireAt;
      await user.save();

      // Prepare email subject
      let subject =
        purpose === "register"
          ? "Resend OTP - Verify Your Email"
          : "Resend OTP - Reset Your Password";

      // Send OTP email
      await transporter.sendMail({
        from: config.EMAIL,
        to: email,
        subject,
        text: `Your OTP is ${otp}. It expires in 5 minutes.`,
      });

      return res.status(200).json({ message: "New OTP sent successfully" });
    } catch (error) {
      console.error("Resend OTP error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },

  // get me
  // getMe: async (req, res) => {
  //   try {
  //     const { id } = req.params;
  //     console.log(id);

  //     const user = await User.findById(id);
  //     console.log(user);

  //     if (user) {
  //       return res.status(200).json({
  //         user: {
  //           name: user.name,
  //           email: user.email,
  //           role: user.role,
  //         },
  //       });
  //     } else {
  //       return res.status(404).json({ message: "User not found" });
  //     }
  //   } catch (error) {
  //     return res.status(500).json({ message: "Internal server error", error });
  //   }
  // },

  // getMe: async (req, res) => {
  //   console.log("im inside get me");
  //   try {
  //     const { id } = req.params;
  //     console.log("id", req.params);
  //     const user = await User.findById(id).populate({
  //       path: "address",
  //       model: "Address", // Matches your Address model
  //     });
  //     console.log("User", user);

  //     if (!user) {
  //       return res.status(404).json({ message: "User not found" });
  //     }

  //     return res.status(200).json({
  //       user: {
  //         name: user.name,
  //         email: user.email,
  //         role: user.role,
  //         address: user.address, // Full address objects due to populate
  //       },
  //     });
  //   } catch (error) {
  //     return res.status(500).json({ message: "Internal server error", error });
  //   }
  // },

  getMe: async (req, res) => {
    try {
      const { id } = req.params;

      console.log("Fetching user with ID:", id);

      // Find user and populate addresses
      const user = await User.findById(id)
      

      console.log("User fetched:", user);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      return res.status(200).json({
        user: {
          name: user.name,
          email: user.email,
          phone : user.phone,
          role: user.role,
          address: user.address || [], // Ensure it returns an empty array if no addresses
        },
      });
    } catch (error) {
      console.error("Error in getMe:", error); // Log full error
      return res
        .status(500)
        .json({ message: "Internal server error", error: error.message });
    }
  },

  updateMe: async (req, res) => {

    console.log("Inside update me")
    try {
      const { id } = req.params;
      console.log('iddd')
      console.log("id",req.params)

      const { name, phone, address } = req.body;

       console.log('REQ.BODY', req.body)

      const user = await User.findById(id);
      if (user) {
        if (name) user.name = name;
        if (phone) user.phone = phone;
        if (address) user.address = address;

        await user.save();
        return res
          .status(200)
          .json({ message: "User updated successfully", user });
      } else {
        return res.status(404).json({ message: "User not found" });
      }
    } catch (error) {
      console.error("Update User Error:", error); // Detailed log

      return res.status(500).json({ message: "Internal server error", error });
    }
  },
};

export default authController;
