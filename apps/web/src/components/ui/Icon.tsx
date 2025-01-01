import { cn } from "@/utils/shadcn";
import React, { SVGProps } from "react";

// prettier-ignore
const icons = {
  arrowLeft: ["M11 17H10L5 12L10 7H11V11H17H19V13H11V17Z"],
  arrowRight: ["M13 7H14L19 12L14 17H13V13H7H5V11H13V7Z"],
  arrowUpRight: ["M19.125 6V15.75C19.125 16.0484 19.0064 16.3345 18.7955 16.5455C18.5845 16.7565 18.2983 16.875 18 16.875C17.7016 16.875 17.4154 16.7565 17.2045 16.5455C16.9935 16.3345 16.875 16.0484 16.875 15.75V8.71875L6.7959 18.7959C6.58455 19.0073 6.29791 19.126 5.99902 19.126C5.70014 19.126 5.41349 19.0073 5.20215 18.7959C4.9908 18.5846 4.87207 18.2979 4.87207 17.9991C4.87207 17.7002 4.9908 17.4135 5.20215 17.2022L15.2812 7.125H8.24996C7.95159 7.125 7.66544 7.00647 7.45446 6.7955C7.24349 6.58452 7.12496 6.29837 7.12496 6C7.12496 5.70163 7.24349 5.41548 7.45446 5.2045C7.66544 4.99353 7.95159 4.875 8.24996 4.875H18C18.2983 4.875 18.5845 4.99353 18.7955 5.2045C19.0064 5.41548 19.125 5.70163 19.125 6Z"],
  chevronDown: ["M14.5248 10.75C15.3081 10 16.0248 9.22505 16.6748 8.42505L16.9248 8.70005L17.3248 9.10005C17.3581 9.13338 17.3998 9.17505 17.4498 9.22505C17.4998 9.27505 17.5665 9.34171 17.6498 9.42505C17.7331 9.50838 17.8498 9.62505 17.9998 9.77505C18.1331 9.92505 18.3081 10.125 18.5248 10.375L18.4998 10.4C17.9831 10.9 17.4915 11.425 17.0248 11.975C16.5415 12.5084 16.0498 13.0417 15.5498 13.575C15.0498 14.1084 14.5331 14.6417 13.9998 15.175C13.4665 15.7084 12.8831 16.2084 12.2498 16.675C11.8498 16.3584 11.4498 16.0084 11.0498 15.625C10.6331 15.2417 10.2165 14.8417 9.7998 14.425C9.36647 14.0084 8.94147 13.5917 8.5248 13.175C8.09147 12.7584 7.6748 12.3584 7.2748 11.975C7.00814 11.725 6.75814 11.4834 6.5248 11.25C6.2748 11.0167 6.03314 10.7834 5.7998 10.55C5.88314 10.4 6.00814 10.25 6.1748 10.1C6.3248 9.95005 6.48314 9.79171 6.6498 9.62505C6.81647 9.45838 6.98314 9.29172 7.1498 9.12505C7.2998 8.95838 7.4248 8.80005 7.5248 8.65005C7.84147 8.90005 8.19147 9.20838 8.5748 9.57505C8.95814 9.94171 9.36647 10.3334 9.7998 10.75C10.2165 11.15 10.6415 11.5584 11.0748 11.975C11.5081 12.375 11.9248 12.7334 12.3248 13.05C13.0081 12.2667 13.7415 11.5 14.5248 10.75Z"],
  chevronUp: ["M9.79941 13.35C9.01608 14.1 8.29941 14.875 7.64942 15.675L7.39942 15.4L6.99941 15C6.96608 14.9667 6.92441 14.925 6.87441 14.875C6.82441 14.825 6.75775 14.7584 6.67441 14.675C6.59108 14.5917 6.47441 14.475 6.32441 14.325C6.19108 14.175 6.01608 13.975 5.79941 13.725L5.82441 13.7C6.34108 13.2 6.83275 12.675 7.29941 12.125C7.78275 11.5917 8.27442 11.0584 8.77442 10.525C9.27442 9.99172 9.79108 9.45838 10.3244 8.92505C10.8577 8.39172 11.4411 7.89172 12.0744 7.42505C12.4744 7.74172 12.8744 8.09172 13.2744 8.47505C13.6911 8.85838 14.1077 9.25838 14.5244 9.67505C14.9577 10.0917 15.3827 10.5084 15.7994 10.925C16.2327 11.3417 16.6494 11.7417 17.0494 12.125C17.3161 12.375 17.5661 12.6167 17.7994 12.85C18.0494 13.0834 18.2911 13.3167 18.5244 13.55C18.4411 13.7 18.3161 13.85 18.1494 14C17.9994 14.15 17.8411 14.3084 17.6744 14.475C17.5077 14.6417 17.3411 14.8084 17.1744 14.975C17.0244 15.1417 16.8994 15.3 16.7994 15.45C16.4827 15.2 16.1327 14.8917 15.7494 14.525C15.3661 14.1584 14.9577 13.7667 14.5244 13.35C14.1077 12.95 13.6827 12.5417 13.2494 12.125C12.8161 11.725 12.3994 11.3667 11.9994 11.05C11.3161 11.8334 10.5827 12.6 9.79941 13.35Z"],
  chevronRight: ["M12.2144 12.0001L6.48218 6.26783L10.0177 2.7323L19.2855 12.0001L10.0177 21.2678L6.48218 17.7323L12.2144 12.0001Z"],
  circleArrowDown: ["M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22ZM17 12H13.25V5.75H10.75V12H7V13.25L12 18.25L17 13.25V12Z"],
  circleArrowLeft: ["M2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12ZM12 17V13.25H18.25V10.75L12 10.75V7H10.75L5.75 12L10.75 17H12Z"],
  circleArrowRight: ["M22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12ZM12 7V10.75H5.75V13.25H12V17H13.25L18.25 12L13.25 7H12Z"],
  circleArrowUp: ["M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2ZM7 12H10.75L10.75 18.25H13.25V12L17 12V10.75L12 5.75L7 10.75V12Z"],
  circleCheck: ["M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22ZM17.8839 9.13388L16.1161 7.36612L10.125 13.3572L7.88388 11.1161L6.11612 12.8839L10.125 16.8928L17.8839 9.13388Z"],
  circlePlus: ["M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22ZM10.75 10.75V7H13.25V10.75H17V13.25H13.25V17H10.75V13.25H7V10.75H10.75Z"],
  circleQuestion: ["M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22ZM12 8.25C10.9645 8.25 10.125 9.08947 10.125 10.125V10.75H7.625V10.125C7.625 7.70875 9.58375 5.75 12 5.75C14.4162 5.75 16.375 7.70875 16.375 10.125C16.375 12.5412 14.4162 14.5 12 14.5H10.75V12H12C13.0355 12 13.875 11.1605 13.875 10.125C13.875 9.08947 13.0355 8.25 12 8.25ZM13.25 15.75V18.25H10.75V15.75H13.25Z"],
  circleExclamation: ["M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22ZM10.75 13.25V5.75H13.25V13.25H10.75ZM10.75 18.25V15.75H13.25V18.25H10.75Z"],
  circleX: ["M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22ZM7.36612 9.13388L10.2322 12L7.36612 14.8661L9.13388 16.6339L12 13.7678L14.8661 16.6339L16.6339 14.8661L13.7678 12L16.6339 9.13388L14.8661 7.36612L12 10.2322L9.13388 7.36612L7.36612 9.13388Z"],
  circleInfo: ["M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12ZM10.75 12H9.5V9.5H13.25V15.75H14.5V18.25H10.75V12ZM13.25 8.25V5.75H10.75V8.25H13.25Z"],
  dots: ["M14.5 12C14.5 13.3807 13.3807 14.5 12 14.5C10.6193 14.5 9.5 13.3807 9.5 12C9.5 10.6193 10.6193 9.5 12 9.5C13.3807 9.5 14.5 10.6193 14.5 12Z", "M7 12C7 13.3807 5.88071 14.5 4.5 14.5C3.11929 14.5 2 13.3807 2 12C2 10.6193 3.11929 9.5 4.5 9.5C5.88071 9.5 7 10.6193 7 12Z", "M22 12C22 13.3807 20.8807 14.5 19.5 14.5C18.1193 14.5 17 13.3807 17 12C17 10.6193 18.1193 9.5 19.5 9.5C20.8807 9.5 22 10.6193 22 12Z"],
  lightning: ["M13.25 10.75L14.5 2H12L4.5 10.75V13.25H10.75L9.5 22H12L19.5 13.25L19.5 10.75H13.25Z"],
  plus: ["M14.5 3.25H9.5V9.5L3.25 9.5V14.5H9.5V20.75H14.5V14.5H20.75V9.5L14.5 9.5V3.25Z"],
  swap: ["M14.5 12H13.25V8.02476L8.4466 7.06407C8.23354 7.02146 8.01679 7 7.79951 7C5.97724 7 4.5 8.47724 4.5 10.2995V13.25H2V10.2995C2 7.09653 4.59653 4.5 7.79951 4.5C8.18142 4.5 8.56239 4.53772 8.93689 4.61262L13.25 5.47525V2H14.5L19.5 7L14.5 12Z", "M22 10.75V13.7005C22 16.9035 19.4035 19.5 16.2005 19.5C15.8186 19.5 15.4376 19.4623 15.0631 19.3874L10.75 18.5248V22H9.5L4.5 17L9.5 12H10.75V15.9752L15.5534 16.9359C15.7665 16.9785 15.9832 17 16.2005 17C18.0228 17 19.5 15.5228 19.5 13.7005V10.75H22Z"],
  x: ["M8.46466 12.0001L2.73242 6.26783L6.26796 2.7323L12.0002 8.46453L17.7324 2.7323L21.268 6.26783L15.5357 12.0001L21.268 17.7323L17.7324 21.2678L12.0002 15.5356L6.26796 21.2678L2.73242 17.7323L8.46466 12.0001Z"],
  spinner: ["M2.25 11.9999C2.25 17.3858 6.61406 21.7499 12 21.7499C17.3859 21.7499 21.75 17.3858 21.75 11.9999H19.3125C19.3125 13.4483 18.8813 14.8593 18.0797 16.0639C17.2734 17.2639 16.1344 18.2014 14.7984 18.7546C13.4625 19.3077 11.9906 19.453 10.575 19.1718C9.15469 18.8858 7.85156 18.1921 6.82969 17.1702C5.80781 16.1483 5.10937 14.8452 4.82813 13.4249C4.54687 12.0046 4.69219 10.5374 5.24531 9.20144C5.79844 7.8655 6.73594 6.72175 7.93594 5.92019C9.14063 5.11394 10.5516 4.68738 12 4.68738V2.24988C6.61406 2.24988 2.25 6.61394 2.25 11.9999Z"],
  layers: ["M3.25 8.25V5.75L12 2L20.75 5.75V8.25L12 12L3.25 8.25Z", "M12 22L3.25 18.25V15.75L12 19.5L20.75 15.75V18.25L12 22Z", "M3.25 13.25L12 17L20.75 13.25V10.75L12 14.5L3.25 10.75V13.25Z"],
  arrowLeftRight: ["M8.25 22V18.25L22 18.25V15.75L8.25 15.75L8.25 12H7L2 17L7 22H8.25Z", "M15.75 12L15.75 8.25L2 8.25L2 5.75L15.75 5.75V2L17 2L22 7L17 12H15.75Z"],
  stats: ["M22 3.25H17V20.75H22V3.25Z", "M9.5 8.25H14.5V20.75H9.5V8.25Z", "M2 13.25H7V20.75H2V13.25Z"],
  treasury: ["M4 7.2L12 4L20 6.66667V9.33333H4V7.2Z", "M13 11.4667H15V16.8H17V11.4667H19V17.8667H20V20H4V17.8667H5V11.4667H7V16.8H9V11.4667H11V16.8H13V11.4667Z"],
  home: ["M3.25 9.5V20.75H9.5V15.75C9.5 14.3693 10.6193 13.25 12 13.25C13.3807 13.25 14.5 14.3693 14.5 15.75V20.75H20.75V9.5L12 2L3.25 9.5Z"],
};

export type IconType = keyof typeof icons;

interface IconProps extends SVGProps<SVGSVGElement> {
  icon: IconType;
  size?: number;
}

export default function Icon({ icon, size, className, ...props }: IconProps) {
  const sizeInternal = size ?? 24;
  return (
    <svg
      height={sizeInternal}
      width={sizeInternal}
      viewBox={`0 0 24 24`}
      className={cn("fill-content-primary", className)}
      {...props}
      xmlns="http://www.w3.org/2000/svg"
    >
      {icons[icon].map((d, i) => (
        <path
          d={d}
          height={sizeInternal}
          width={sizeInternal}
          key={i}
          fillRule="evenodd"
          clipRule="evenodd"
        />
      ))}
    </svg>
  );
}
