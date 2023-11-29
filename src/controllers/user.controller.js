import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { User } from '../models/user.model.js';
import uploadOnCloudinary from '../utils/cloudinary.js';
import { ApiResponse } from '../utils/ApiResponse.js';

const registerUser = asyncHandler(async (req, res) => {
  const { username, email, fullName, password } = req.body;
  console.log(req.body);
  if (
    [fullName, email, username, password].some((feild) => feild?.trim() === '')
  ) {
    throw new ApiError(400, `All feilds are required`);
  }

  const isExist = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (isExist) {
    throw new ApiError(409, 'User with username or email already exists');
  }
  const avatarLocaPath = req.files?.avatar[0]?.path;
  console.log(req.files);
  const coverImageLocalPath = req.files?.coverImage[0]?.path;
  if (!avatarLocaPath) {
    throw new ApiError(400, 'Avatar file is required');
  }

  const avatar = await uploadOnCloudinary(avatarLocaPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!avatar) {
    throw new ApiError(400, 'Avatar file is required');
  }

  const user = await User.create({
    username: username.toLowerCase(),
    email,
    password,
    fullName,
    avatar: avatar?.url,
    coverImage: coverImage?.url || '',
  });
  const createdUser = await User.findById(user?._id).select(
    '-password -refreshToken'
  );
  if (!createdUser) {
    throw new ApiError(500, 'Something went wrong while registering user');
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, 'User registered successfully'));
});

export { registerUser };
