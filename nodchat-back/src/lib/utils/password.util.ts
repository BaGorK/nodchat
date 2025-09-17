import bcrypt from "bcryptjs";

export const isCorrectPassword = async (data: {
  pass: string;
  hashedPass: string;
}) => {
  const { pass, hashedPass } = data;
  return await bcrypt.compare(pass, hashedPass);
};
