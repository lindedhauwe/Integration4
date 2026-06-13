import { useNavigate } from 'react-router';
import Beer from '../components/Beer';

export default function BeerLoading() {
  const navigate = useNavigate();

  const handleEmpty = () => {
    // Brief pause so the user sees the empty glass before navigating
    setTimeout(() => navigate('/'), 800);
  };

  return <Beer onEmpty={handleEmpty} />;
}
