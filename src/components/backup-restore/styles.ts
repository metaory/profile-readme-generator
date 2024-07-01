import styled, { css } from 'styled-components';

export const RestoreInput = styled.input`
  display: none;
`;

type FileButtonProps = {
  hue?: string;
};

export const FileButton = styled.a<FileButtonProps>`
  ${({ theme, hue }) =>
    css`
      border: none;
      display: grid;
      place-items: center;
      background-color: hsla(${hue}, 60%, 40%, 0.8);
      color: ${theme.colors.text};
      border-radius: ${theme.border.radius};
      width: auto;
      max-width: 16.5rem;
      height: 3.2rem;
      font-weight: ${theme.font.weights.bold};
      padding: 0 ${theme.spacings.medium};
      transition: filter 0.3s;

      &:hover {
        filter: brightness(1.3);
        cursor: pointer;
        text-decoration: none;
      }
    `}
`;
