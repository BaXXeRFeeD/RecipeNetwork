import {categories} from '../data/mockData';

const CategoryFilter = ({onFilter}) => {
    return (
        <select onChange={(e) => onFilter(e.target.value)} className="w-full border p-2 mb-4">
            <option value="">Все категории</option>
            {categories.map((c) => (
                <option key={c} value={c}>
                    {c}
                </option>
            ))}
        </select>
    );
};

export default CategoryFilter;