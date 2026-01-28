import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Option = {
  value: string;
  label: string;
};

type CustomSelectInputProps = {
  options: Option[];
  placeholder: string;
  value?: string;
  onChange: (value: string) => void;
};

const CustomSelectInput = ({
  options,
  placeholder,
  value,
  onChange,
}: CustomSelectInputProps) => {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className="w-full bg-background">
        {options.map((option) => (
          <SelectItem
            key={option.value}
            value={option.value}
            className="hover:bg-accent hover:bg-chart-accent hover:text-background"
          >
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
export default CustomSelectInput;
