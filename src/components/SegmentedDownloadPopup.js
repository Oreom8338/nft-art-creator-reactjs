import React from 'react';
import { Modal, Button, ListGroup } from 'react-bootstrap';

const SegmentedDownloadPopup = ({ show, onClose, collectionSize, onBatchSelect }) => {
    const calculateBatches = (collectionSize) => {
        const batches = [];
        for (let start = 1; start <= collectionSize; start += 100) {
            const end = Math.min(start + 99, collectionSize);
            batches.push({ start, end });
        }
        return batches;
    };

    const batches = calculateBatches(collectionSize);

    return (
        <Modal show={show} onHide={onClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Choose a batch to generate</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <ListGroup>
                    {batches.map((batch, index) => (
                        <ListGroup.Item key={index} action onClick={() => onBatchSelect(batch.start, batch.end)}>
                            {batch.start} to {batch.end}
                        </ListGroup.Item>
                    ))}
                </ListGroup>
            </Modal.Body>
        </Modal>
    );
};

export default SegmentedDownloadPopup;
