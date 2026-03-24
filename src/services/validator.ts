export const isRequired = (value: string): string | null => {
  if (!value || value.trim() === "") {
    return "This field is required";
  }
  return null;
};

export const isNumericString = (value: string): string | null => {
  if (!value || value.trim() === "") {
    return "This field is required";
  }

  const regex = /^[0-9]+$/;

  if (!regex.test(value)) {
    return "Only numeric characters are allowed";
  }

  return null;
};

export const isEmail = (value: string): string | null => {
  if (!value || value.trim() === "") {
    return "Email is required";
  }

  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!regex.test(value)) {
    return "Invalid email address";
  }

  return null;
};

export const validatePassword = (value: string): string | null => {
  if (!value || value.trim() === "") return "Password is required";

  if (value.length < 8) {
    return "Password must be at least 8 characters";
  }

  return null;
};

export const validateConfirmPassword = (
  password: string,
  confirmPassword: string,
): string | null => {
  if (!confirmPassword) return "Please confirm your password";

  if (password !== confirmPassword) {
    return "Passwords do not match";
  }

  return null;
};
