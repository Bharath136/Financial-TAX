// ClientFilter.js
import React from 'react';
import { ClientsHeaderContainer, FilterSelect, SearchBar, SearchBarContainer, SearchButton } from './styledComponents';
import { BiSearch } from 'react-icons/bi';
import { MdFilterList } from 'react-icons/md';

const ClientFilter = ({ selectedFilter, handleFilterChange, handleSearchChange, onSearch, searchTerm }) => {
    return (
        <ClientsHeaderContainer>
            <SearchBarContainer>
                <SearchBar
                    type="text"
                    placeholder="Search client by N.., E.., P.."
                    value={searchTerm}
                    onChange={handleSearchChange}
                />
                <SearchButton onClick={onSearch} type="button">
                    <BiSearch size={25} />
                </SearchButton>
            </SearchBarContainer>
            <div>
                <label htmlFor="filterDropdown">
                    <MdFilterList size={20} />
                </label>
                <FilterSelect
                    id="filterDropdown"
                    value={selectedFilter}
                    onChange={(e) => handleFilterChange(e.target.value)}
                >
                    <option value="">All Clients</option>
                    <option value="assigned">Assigned Clients</option>
                    <option value="unassigned">Unassigned Clients</option>
                </FilterSelect>
            </div>
        </ClientsHeaderContainer>
    );
};

export default ClientFilter;
