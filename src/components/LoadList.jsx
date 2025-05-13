import LoadCard from './LoadCard';
import './LoadList.css';

const LoadList = ({ loads }) => {
  return (
    <div className="load-list-container">
      {loads.map((load) => (
        <LoadCard key={load.id} load={load} />
      ))}
    </div>
  );
};

export default LoadList;