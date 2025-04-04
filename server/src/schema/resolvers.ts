import { User } from '../models/index.js';
import { signToken, AuthenticationError } from "../services/auth.js"; 
interface AddUserArgs {
    input: {
        username: string;
        email: string;
        password: string;
    }
}
interface LoginUserArgs {
    email: string;
    password: string;
}
interface BookInput {
    input: {
        author: [string];
        description: string;
        title: string;
        bookId: string;
        }
}
interface BookArgs {
    bookId: string;
    }

const resolvers = {
  Query: {
        me: async (_parent: any, _args: any, context: any) => {
            if (context.user) {
                return User.findOne({ _id: context.user._id }).populate('savedBooks');
            }
            throw new AuthenticationError('could not authenticate User.');
      }
  },
  Mutation: {
    addUser: async (_parent: any, { input }: AddUserArgs) => {
      const user = await User.create({ ...input });

      const token = signToken(user.username, user.email, user._id);

      return { token, user };
    },
    login: async (_parent: any, { email, password }: LoginUserArgs) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError("Could not authenticate user.");
      }
      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError("Could not authenticate user.");
      }

      const token = signToken(user.username, user.email, user._id);

      return { token, user };
    },
    saveBook: async ( _parent: any,{ input }: { input: BookInput }, context: any) => {
      if (context.user) {
        // Update the user to add the new book to their savedBooks
        const addBook = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $addToSet: { savedBooks: input } }, // Directly add the input as a new book subdocument
          { new: true }
        );
          return addBook
      }
        throw new AuthenticationError("you need to be logged in");
      },
      removeBook: async (_parent: any, { bookId }: BookArgs, context: any) => {
          if (context.user) {
              const deleteBook = await User.findOneAndUpdate(
                { _id: context.user._id },
                { $pull: { savedBooks: { bookId: bookId } } },
                { new: true },
              );
              return deleteBook
          }
          throw new AuthenticationError("you need to be logged in");
    }
  },
};

export default resolvers;