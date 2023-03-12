const { AuthenticationError } = require('apollo-server-express');
const { User, JobPosting, Thought, Company } = require('../models');
const { signToken } = require('../utils/auth');
const fs = require('fs')
const path = require('path')

const resolvers = {
  Query: {
    users: async () => {
      return User.find()
    },
    user: async (parent, { username }) => {
      return User.findOne({ username })
    },
    companies: async () => {
      return Company.find()
    },
    company: async (parent, { companyname }) => {
      return Company.findOne({ companyname })
    },
    thoughts: async (parent, { username }) => {
      const params = username ? { username } : {};
      return Thought.find(params).sort({ createdAt: -1 });
    },
    thought: async (parent, { thoughtId }) => {
      return Thought.findOne({ _id: thoughtId });
    },    
    me: async (parent, args, context) => {
      if (context.user) {
        return User.findOne({ _id: context.user._id }).populate('thoughts');
      }
      throw new AuthenticationError('You need to be logged in!');
    },
  },

  Mutation: {
    addUser: async (parent, { username, email, password }) => {
      const user = await User.create({ username, email, password });
      const token = signToken(user);
      return { token, user };
    },
    addCompany: async (parent, { companyname, email, password }) => {
      const user = await Company.create({ companyname, email, password });
      const token = signToken(user);
      return { token, user };
    },
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError('No user found with this email address');
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError('Incorrect credentials');
      }

      const token = signToken(user);

      return { token, user };
    },
    companyLogin: async (parent, { email, password }) => {
      const company = await Company.findOne({ email });

      if (!company) {
        throw new AuthenticationError('No company found with this email address');
      }

      const correctPw = await company.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError('Incorrect credentials');
      }

      const token = signToken(company);

      return { token, company };
    },
    createJobPosting: async (parent, { title, description}, context) => {
      if (context.user) {
        const jobPosting = await JobPosting.create({
          title,
          description,
          Author: context.user.username,
        });

        await User.findOneAndUpdate(
          { _id: context.user._id },
          { $addToSet: { jobpostings: jobposting._id } }
        );

        return jobPosting;
      }
      throw new AuthenticationError('You need to be logged in!');
    },
    removeJobPosting: async (parent, { jobpostingId }, context) => {
      if (context.user) {
        const jobposting = await JobPosting.findOneAndDelete({
          _id: jobpostingId,
          Author: context.user.username,
        });

        await User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { jobpostings: jobposting._id } }
        );

        return jobposting;
      }
      throw new AuthenticationError('You need to be logged in!');
    },
    likeJobPosting: async (parent, args, context) => {
      if (context.user) {
        return JobPosting.findOneAndUpdate(
          { _id: jobpostingId },
          {
            $addToSet: {
              comments: { commentText, commentAuthor: context.user.username },
            },
          },
          {
            new: true,
            runValidators: true,
          }
        );
      }
      throw new AuthenticationError('You need to be logged in!');
    },
    addThought: async (parent, { thoughtText }, context) => {
      if (context.user) {
        const thought = await Thought.create({
          thoughtText,
          thoughtAuthor: context.user.username,
        });

        await User.findOneAndUpdate(
          { _id: context.user._id },
          { $addToSet: { thoughts: thought._id } }
        );

        return thought;
      }
      throw new AuthenticationError('You need to be logged in!');
    },
    removeThought: async (parent, { thoughtId }, context) => {
      if (context.user) {
        const thought = await Thought.findOneAndDelete({
          _id: thoughtId,
          thoughtAuthor: context.user.username,
        });

        await User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { thoughts: thought._id } }
        );

        return thought;
      }
      throw new AuthenticationError('You need to be logged in!');
    },
    uploadImage: async (parent, { file }, context, info) => {
      const { createReadStream, filename, mimetype, encoding } = await file

      const stream = createReadStream()
      const pathName = path.join(__dirname, `../public/images/${filename}`)
      await stream.pipe(fs.createWriteStream(pathName))
      
      return {
        url: `http://localhost:3000/public/images/${filename}`
      }
    },
    updateUser: async (_, { id, username, email, password, profilePicture, bio }) => {
      const user = await User.findByIdAndUpdate(
        id,
        { username, email, password, profilePicture, bio, },
        { new: true }
      );
      return user;
    },
    updateCompany: async (_, { id, companyname, email, password, profilePicture, bio }) => {
      const company = await Company.findByIdAndUpdate(
        id,
        { companyname, email, password, profilePicture, bio, },
        { new: true }
      );
      return company;
    },
  },
};

module.exports = resolvers;
