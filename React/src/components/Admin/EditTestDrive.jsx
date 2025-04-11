import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const EditTestDrive = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [status, setStatus] = useState("");
    const [loading, setLoading] = useState(false);
    const [testDrive, setTestDrive] = useState(null);
    const [isEditing, setIsEditing] = useState(false); // Control visibility of the form

    // Fetch test drive details on component mount
    useEffect(() => {
        const fetchTestDrive = async () => {
            try {
                const response = await axios.get(`/api/testdrive/${id}`);
                setTestDrive(response.data.data);
                setStatus(response.data.data.status); // Set current status
            } catch (error) {
                console.error("There was an error fetching the test drive details", error);
            }
        };

        fetchTestDrive();
    }, [id]);

    // Handle the status change
    const handleStatusChange = (e) => {
        setStatus(e.target.value);
    };

    // Handle form submission to update the test drive status
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await axios.put(`/api/testdrive/${id}/status`, { status });
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Test drive status updated successfully!',
            });
            navigate("/Admin/TestDrives"); // Redirect after success
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Update Failed',
                text: 'There was an error updating the status. Please try again.',
            });
            console.error('Error updating test drive status:', error);
        } finally {
            setLoading(false);
        }

    };

    // Loading state when fetching data or submitting form
    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container">
            <h2>Edit Test Drive</h2> {/* Heading displayed on page load */}

            {/* Only show the edit button */}
            {!isEditing && (
                <button
                    onClick={() => setIsEditing(true)} // Show the edit form when clicked
                    className="btn btn-warning"
                >
                    Edit Test Drive
                </button>
            )}

            {/* Show the form when the edit button is clicked */}
            {isEditing && testDrive && (
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="status">Test Drive Status</label>
                        <select
                            id="status"
                            className="form-control"
                            value={status}
                            onChange={handleStatusChange}
                        >
                            <option value="approved">Approved</option>
                            <option value="canceled">Canceled</option>
                        </select>
                    </div>
                    <button type="submit" className="btn btn-primary">
                        Update Status
                    </button>
                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => setIsEditing(false)} // Hide the form when cancel is clicked
                    >
                        Cancel
                    </button>
                </form>
            )}
        </div>
    );
};

export default EditTestDrive;
