import React, { useState, useRef, useEffect } from 'react';
import './MultiSelect.css';

interface MultiSelectProps {
    label: string;
    options: string[];
    selectedValues: string[];
    onSelectionChange: (values: string[]) => void;
    placeholder?: string;
}

export const MultiSelect: React.FC<MultiSelectProps> = ({
    label,
    options,
    selectedValues,
    onSelectionChange,
    placeholder = "Select options..."
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleOptionToggle = (option: string) => {
        const newSelection = selectedValues.includes(option)
            ? selectedValues.filter(value => value !== option)
            : [...selectedValues, option];
        onSelectionChange(newSelection);
    };

    const handleSelectAll = (event: React.MouseEvent) => {
        event.stopPropagation();
        onSelectionChange(selectedValues.length === options.length ? [] : options);
    };

    const handleDropdownClick = (event: React.MouseEvent) => {
        event.stopPropagation();
        setIsOpen(!isOpen);
    };

    const getDisplayText = () => {
        if (selectedValues.length === 0) return placeholder;
        if (selectedValues.length === options.length) return `All ${label}`;
        if (selectedValues.length === 1) return selectedValues[0];
        return `${selectedValues.length} selected`;
    };

    return (
        <div className="multi-select-container" ref={dropdownRef}>
            <label className="multi-select-label">{label}:</label>
            <div className={`multi-select-dropdown ${isOpen ? 'open' : ''}`}>
                <div 
                    className="multi-select-display"
                    onClick={handleDropdownClick}
                >
                    <span className="multi-select-text">{getDisplayText()}</span>
                    <span className="multi-select-arrow">▼</span>
                </div>
                {isOpen && (
                    <div className="multi-select-options">
                        <div className="multi-select-option select-all" onClick={handleSelectAll}>
                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    checked={selectedValues.length === options.length}
                                    className="checkbox-input"
                                    readOnly
                                />
                                <span className="checkbox-custom"></span>
                                <span className="checkbox-text">
                                    {selectedValues.length === options.length ? 'Deselect All' : 'Select All'}
                                </span>
                            </label>
                        </div>
                        
                        <div className="multi-select-divider"></div>
                        
                        {options.length === 0 ? (
                            <div className="multi-select-no-options">No options found</div>
                        ) : (
                            options.map(option => (
                                <div key={option} className="multi-select-option">
                                    <label className="checkbox-label">
                                        <input
                                            type="checkbox"
                                            checked={selectedValues.includes(option)}
                                            onChange={() => handleOptionToggle(option)}
                                            className="checkbox-input"
                                        />
                                        <span className="checkbox-custom"></span>
                                        <span className="checkbox-text">{option}</span>
                                    </label>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};