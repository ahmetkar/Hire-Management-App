"use client";

type ConfirmModalProps = {
  show: boolean;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  setConfirm:boolean;
  onCancel: () => void;
};

export default function Modal({
  show,
  title = "Onay",
  message = "Bu işlemi yapmak istediğinize emin misiniz?",
  confirmText = "Evet",
  cancelText = "Vazgeç",
  onConfirm,
  setConfirm = true,
  onCancel,
}: ConfirmModalProps) {
  if (!show) return null;

  return (
    <>
      <div
        className="modal fade show d-block"
        tabIndex={-1}
        role="dialog"
        style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      >
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{title}</h5>

              <button
                type="button"
                className="close"
                onClick={onCancel}
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>

            <div className="modal-body">
              <p>{message}</p>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onCancel}
              >
                {cancelText}
              </button>
            {(setConfirm) && (
               <button
                type="button"
                className="btn btn-danger"
                onClick={onConfirm}
              >
                {confirmText}
              </button>
            )}
             
            </div>
          </div>
        </div>
      </div>
    </>
  );
}