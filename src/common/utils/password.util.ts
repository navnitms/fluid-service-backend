import bcrypt from 'bcrypt';

export async function hash(input: string): Promise<string> {
  return bcrypt.hash(input, 10);
}

export async function comparePass(
  inputValue: string,
  hashedValue: string,
): Promise<boolean> {
  return bcrypt.compareSync(inputValue, hashedValue);
}
