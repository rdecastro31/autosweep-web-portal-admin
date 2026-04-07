import { Card, Col, Row } from "react-bootstrap";

function StatsCards() {
  const stats = [
    { title: "Total Customers", value: "1,250" },
    { title: "Active RFID Tags", value: "1,180" },
    { title: "Inactive Accounts", value: "70" },
    { title: "Today’s Transactions", value: "342" },
  ];

  return (
    <Row className="g-4">
      {stats.map((item, index) => (
        <Col md={6} xl={3} key={index}>
          <Card className="stats-card">
            <Card.Body>
              <h6 className="text-muted">{item.title}</h6>
              <h3 className="mb-0">{item.value}</h3>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );
}

export default StatsCards;