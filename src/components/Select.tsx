export interface SelectProps<T> {
    name: string;
    selectedValue: T;
    options: {
        name: string;
        value: T;
    }[];
    onSelect: (value: T) => void;
}

export default function Select({ name, selectedValue, options, onSelect }: SelectProps<any>) {
    return (
        <div className="flex flex-col">
            {name}
            <select
                value={selectedValue}
                onChange={(e) => {
                    onSelect(e.target.value);
                }}
                placeholder={name}
            >
                {options.map((option, i) => (
                    <>
                        <option value={option.value} key={i} title={name}>
                            {option.name}
                        </option>
                    </>
                ))}
            </select>
        </div>
    );
}
