import { Col, Form, Row, Table, Tabs, message } from 'antd';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { addExam, deleteQuestionById, editExamById, getExamById } from '../../../apicalls/exams';
import PageTitle from '../../../components/PageTitle';
import { HideLoading, ShowLoading } from '../../../redux/loaderSlice';
import AddEditQuestion from './AddEditQuestion';
const { TabPane } = Tabs;

function AddEditExam() {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const [examData, setExamData] = useState(null);
	const [showAddEditQuestionModal, setShowAddEditQuestionModal] = useState(false);
	const [selectedQuestion, setSelectedQuestion] = useState(null);
	const params = useParams();
	const onFinish = async values => {
		try {
			dispatch(ShowLoading());
			let response;

			if (params.id) {
				response = await editExamById({
					...values,
					examId: params.id,
				});
			} else {
				response = await addExam(values);
			}

			if (response.success) {
				message.success(response.message);
				navigate('/admin/exams');
			} else {
				message.error(response.message);
			}
			dispatch(HideLoading());
		} catch (error) {
			dispatch(HideLoading());
			message.error(error.message);
		}
	};

	const getExamData = async () => {
		try {
			dispatch(ShowLoading());
			const response = await getExamById({
				examId: params.id,
			});
			dispatch(HideLoading());
			if (response.success) {
				setExamData(response.data);
			} else {
				message.error(response.message);
			}
		} catch (error) {
			dispatch(HideLoading());
			message.error(error.message);
		}
	};

	useEffect(() => {
		if (params.id) {
			getExamData();
		}
		// eslint-disable-next-line
	}, []);

	const deleteQuestion = async questionId => {
		try {
			dispatch(ShowLoading());
			const repsonse = await deleteQuestionById({
				questionId,
				examId: params.id,
			});
			dispatch(HideLoading());
			if (repsonse.success) {
				message.success(repsonse.message);
				getExamData();
			} else {
				message.error(repsonse.message);
			}
		} catch (error) {
			dispatch(HideLoading());
			message.error(error.message);
		}
	};

	const questionsColumns = [
		{
			title: 'Savol',
			dataIndex: 'name',
		},
		{
			title: 'Variantlar',
			dataIndex: 'options',
			render: (text, record) => {
				return Object.keys(record.options).map(key => {
					return (
						<div>
							{key}: {record.options[key]}
						</div>
					);
				});
			},
		},
		{
			title: 'Toʼgʼri variant',
			dataIndex: 'correctOption',
			render: (text, record) => {
				return ` ${record.correctOption} : ${record.options[record.correctOption]}`;
			},
		},
		{
			title: 'Harakat',
			dataIndex: 'action',
			render: (text, record) => (
				<div className='flex gap-2'>
					<i
						className='ri-pencil-line'
						onClick={() => {
							setSelectedQuestion(record);
							setShowAddEditQuestionModal(true);
						}}
					></i>
					<i
						className='ri-delete-bin-line'
						onClick={() => {
							deleteQuestion(record._id);
						}}
					></i>
				</div>
			),
		},
	];
	return (
		<div>
			<PageTitle title={params.id ? 'Imtihonni tahrirlash' : 'Imtihon qoʼshish'} />
			<div className='divider'></div>

			{(examData || !params.id) && (
				<Form layout='vertical' onFinish={onFinish} initialValues={examData}>
					<Tabs defaultActiveKey='1'>
						<TabPane tab='Imtihon tafsilotlari' key='1'>
							<Row gutter={[10, 10]}>
								<Col span={8}>
									<Form.Item label='Imtihon nomi' name='name'>
										<input type='text' />
									</Form.Item>
								</Col>
								<Col span={8}>
									<Form.Item label='Imtihon muddati' name='duration'>
										<input type='number' />
									</Form.Item>
								</Col>
								<Col span={8}>
									<Form.Item label='Kategoriya' name='category'>
										<select name='' id=''>
											<option value=''>Kategoriyani tanlang</option>
											<option value='mathematics'>Matematika</option>
											<option value='english'>Ingliz tili</option>
										</select>
									</Form.Item>
								</Col>
								<Col span={8}>
									<Form.Item label='Jami ball' name='totalMarks'>
										<input type='number' />
									</Form.Item>
								</Col>
								<Col span={8}>
									<Form.Item label='Oʼtish ball' name='passingMarks'>
										<input type='number' />
									</Form.Item>
								</Col>
							</Row>
							<div className='flex justify-end gap-2'>
								<button
									className='primary-outlined-btn'
									type='button'
									onClick={() => navigate('/admin/exams')}
								>
									Bekor qilish
								</button>
								<button className='primary-contained-btn' type='submit'>
									Saqlash
								</button>
							</div>
						</TabPane>
						{params.id && (
							<TabPane tab='Savollar' key='2'>
								<div className='flex justify-end'>
									<button
										className='primary-outlined-btn'
										type='button'
										onClick={() => setShowAddEditQuestionModal(true)}
									>
										Savol qo'shish
									</button>
								</div>

								<Table columns={questionsColumns} dataSource={examData?.questions || []} />
							</TabPane>
						)}
					</Tabs>
				</Form>
			)}

			{showAddEditQuestionModal && (
				<AddEditQuestion
					setShowAddEditQuestionModal={setShowAddEditQuestionModal}
					showAddEditQuestionModal={showAddEditQuestionModal}
					examId={params.id}
					refreshData={getExamData}
					selectedQuestion={selectedQuestion}
					setSelectedQuestion={setSelectedQuestion}
				/>
			)}
		</div>
	);
}

export default AddEditExam;
