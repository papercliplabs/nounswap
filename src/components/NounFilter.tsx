import Select, { SelectProps } from "./Select";

interface NounFilterProps {
    backgroundFilterSelectProps: SelectProps<number>;
    bodyFilterSelectProps: SelectProps<number>;
    accessoryFilterSelectProps: SelectProps<number>;
    headFilterSelectProps: SelectProps<number>;
    glassesFilterSelectProps: SelectProps<number>;
}

export default function NounFilter(props: NounFilterProps) {
    return (
        <div className="flex flex-col bg-gray-200 p-6 gap-6 h-min w-[350px] rounded-3xl ">
            <div className="flex flex-row justify-between">
                <h3>Filter</h3>
                <button
                    className="text-blue-500 hover:brightness-[85%]"
                    onClick={() => {
                        props.backgroundFilterSelectProps.onSelect(-1);
                        props.bodyFilterSelectProps.onSelect(-1);
                        props.accessoryFilterSelectProps.onSelect(-1);
                        props.headFilterSelectProps.onSelect(-1);
                        props.glassesFilterSelectProps.onSelect(-1);
                    }}
                >
                    Clear all
                </button>
            </div>
            <Select {...props.backgroundFilterSelectProps} />
            <Select {...props.bodyFilterSelectProps} />
            <Select {...props.accessoryFilterSelectProps} />
            <Select {...props.headFilterSelectProps} />
            <Select {...props.glassesFilterSelectProps} />
        </div>
    );
}
