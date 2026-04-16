import { Card, Empty, Button } from "antd";
import { Star } from "lucide-react";

export default function Starred() {
  const starredItems = [
    {
      id: 1,
      title: "High Priority Patient",
      description: "John Doe - VIP Patient",
      date: "2024-04-15",
    },
    {
      id: 2,
      title: "Important Service",
      description: "Premium Consultation Service",
      date: "2024-04-10",
    },
  ];

  return (
    <div className='p-8'>
      <div className='mb-8'>
        <h1 className='text-3xl font-bold'>Starred</h1>
        <p className='text-gray-600 mt-2'>Your marked important items</p>
      </div>

      {starredItems.length > 0 ? (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
          {starredItems.map(item => (
            <Card
              key={item.id}
              className='hover:shadow-lg transition-shadow'
              hoverable
              extra={
                <Button
                  type='text'
                  icon={<Star size={18} fill='currentColor' />}
                  className='text-yellow-500'
                />
              }>
              <Card.Meta title={item.title} description={item.description} />
              <div className='text-xs text-gray-500 mt-4'>{item.date}</div>
            </Card>
          ))}
        </div>
      ) : (
        <Empty description='No starred items' />
      )}
    </div>
  );
}
