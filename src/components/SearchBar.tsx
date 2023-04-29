import { FC } from 'react';

export const SearchBar: FC = () => {
    return (
      <div className="form-control">
        <div className="input-group">
          <select className="select select-bordered">
            <option disabled selected>All Filters</option>
            <option>Accounts</option>
            <option>Blocks</option>
            <option>Contracts</option>
            <option>Transactions</option>
          </select>
          <input type="text" className="input input-bordered" placeholder="Search by Address / Txn Hash / Block / Token / Domain Name" />
          <button className="btn btn-square">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </button>
        </div>
      </div>
    );
};

