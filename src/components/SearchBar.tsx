import { FC } from 'react';

export const SearchBar: FC = () => {
    return (
      <div className="form-control">
        <div className="input-group m-0">
          <select defaultValue={'all'} className="select select-bordered">
            <option value={'all'}>All Filters</option>
            <option value={'Accounts'}>Accounts</option>
            <option value={'Blocks'}>Blocks</option>
            <option value={'Contracts'}>Contracts</option>
            <option value={'Transactions'}>Transactions</option>
          </select>
          <input type="text" className="input input-bordered w-full" placeholder="Search by Address / Txn Hash / Block / Token / Domain Name" />
          <button className="btn btn-square">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </button>
        </div>
      </div>
    );
};
