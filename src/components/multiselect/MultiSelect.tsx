import React, { useState, useRef, useEffect } from 'react';
import styles from './MultiSelect.module.css';

interface MultiSelectProps {
    options: { value: string; label: string }[];
    selectedValues: string[];
    onChange: (values: string[]) => void;
    placeholder?: string;
    disabled?: boolean;
}

export const MultiSelect: React.FC<MultiSelectProps> = ({
    options,
    selectedValues,
    onChange,
    placeholder = "Select options...",
    disabled = false
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const filteredOptions = options.filter(option =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleToggle = () => {
        if (!disabled) {
            setIsOpen(!isOpen);
            if (!isOpen) {
                setSearchTerm('');
            }
        }
    };

    const handleOptionClick = (value: string) => {
        const newSelectedValues = selectedValues.includes(value)
            ? selectedValues.filter(v => v !== value)
            : [...selectedValues, value];
        onChange(newSelectedValues);
    };

    const removeSelected = (value: string) => {
        onChange(selectedValues.filter(v => v !== value));
    };

    const selectedLabels = selectedValues.map(value => 
        options.find(option => option.value === value)?.label || value
    );

    return (
        <div className={styles.multiSelect} ref={dropdownRef}>
            <div 
                className={`${styles.trigger} ${isOpen ? styles.open : ''} ${disabled ? styles.disabled : ''}`}
                onClick={handleToggle}
            >
                <div className={styles.selectedItems}>
                    {selectedLabels.length > 0 ? (
                        selectedLabels.map((label, index) => (
                            <span key={index} className={styles.selectedItem}>
                                {label}
                                <button
                                    className={styles.removeButton}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        removeSelected(selectedValues[index]);
                                    }}
                                >
                                    ×
                                </button>
                            </span>
                        ))
                    ) : (
                        <span className={styles.placeholder}>{placeholder}</span>
                    )}
                </div>
                <div className={styles.arrow}>▼</div>
            </div>

            {isOpen && (
                <div className={styles.dropdown}>
                    <div className={styles.searchContainer}>
                        <input
                            type="text"
                            placeholder="Search options..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className={styles.searchInput}
                            autoFocus
                        />
                    </div>
                    
                    <div className={styles.optionsList}>
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map(option => (
                                <div
                                    key={option.value}
                                    className={`${styles.option} ${selectedValues.includes(option.value) ? styles.selected : ''}`}
                                    onClick={() => handleOptionClick(option.value)}
                                >
                                    <span className={styles.checkbox}>
                                        {selectedValues.includes(option.value) && (
                                            <span className={styles.checkmark}></span>
                                        )}
                                    </span>
                                    {option.label}
                                </div>
                            ))
                        ) : (
                            <div className={styles.noResults}>
                                No options found matching "{searchTerm}"
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}; 