export interface PasswordValidationRequirement {
  mustContainSpecialCharacter?: boolean;
  mustContainUpperLetter?: boolean;
  mustContainLowerLetter?: boolean;
  mustContainNumber?: boolean;
}

export const passwordRequirement: PasswordValidationRequirement = {
  mustContainLowerLetter: true,
  mustContainNumber: true,
  mustContainSpecialCharacter: true,
  mustContainUpperLetter: true,
};
