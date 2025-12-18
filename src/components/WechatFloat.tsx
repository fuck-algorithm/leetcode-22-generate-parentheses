import { useState } from 'react';

export function WechatFloat() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div style={styles.container}>
      {/* 悬浮提示框 */}
      {isHovered && (
        <div style={styles.tooltip}>
          <div style={styles.tooltipArrow} />
          <img 
            src={import.meta.env.BASE_URL + 'wechat-group.png'}
            alt="微信群二维码" 
            style={styles.qrcode}
          />
          <p style={styles.tooltipText}>
            扫码发送 <strong>leetcode</strong> 加入算法交流群
          </p>
        </div>
      )}
      
      {/* 悬浮球 - 带文字的交流群按钮 */}
      <div
        style={{
          ...styles.floatButton,
          ...(isHovered ? styles.floatButtonHover : {})
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div style={styles.floatContent}>
          <svg viewBox="0 0 1024 1024" width="24" height="24" fill="currentColor">
            <path d="M690.1 377.4c5.9 0 11.8 0.2 17.6 0.5-24.4-128.7-158.3-227.1-319.9-227.1C209 150.8 64 271.4 64 420.2c0 81.1 43.6 154.2 111.9 203.6 5.5 3.9 9.1 10.3 9.1 17.6 0 2.4-0.5 4.6-1.1 6.9-5.5 20.3-14.2 52.8-14.6 54.3-0.7 2.6-1.7 5.2-1.7 7.9 0 5.9 4.8 10.8 10.8 10.8 2.3 0 4.2-0.9 6.2-2l70.9-40.9c5.3-3.1 11-5 17.2-5 3.2 0 6.4 0.5 9.5 1.4 33.1 9.5 68.8 14.8 105.7 14.8 6 0 11.9-0.1 17.8-0.4-7.1-21-10.9-43.1-10.9-66 0-135.8 132.2-245.8 295.3-245.8z m-194.3-86.5c23.8 0 43.2 19.3 43.2 43.1s-19.3 43.1-43.2 43.1c-23.8 0-43.2-19.3-43.2-43.1s19.4-43.1 43.2-43.1z m-215.9 86.2c-23.8 0-43.2-19.3-43.2-43.1s19.3-43.1 43.2-43.1 43.2 19.3 43.2 43.1-19.4 43.1-43.2 43.1z"/>
            <path d="M866.7 637.6c56.9-41.2 93.2-102 93.2-169.7 0-124-120.8-224.5-269.9-224.5-149 0-269.9 100.5-269.9 224.5S540.9 692.3 690 692.3c30.8 0 60.6-4.4 88.1-12.3 2.6-0.8 5.2-1.2 7.9-1.2 5.2 0 9.9 1.6 14.3 4.1l59.1 34c1.7 1 3.3 1.7 5.2 1.7 6.1 0 9-5.1 9-9 0-2.2-0.8-4.4-1.4-6.6-0.3-1.2-7.6-28.3-12.2-45.3-0.5-1.9-0.9-3.8-0.9-5.7 0.1-5.9 3.1-11.2 7.6-14.4zM602.4 490.4c-19.8 0-35.9-16.1-35.9-35.9s16.1-35.9 35.9-35.9 35.9 16.1 35.9 35.9-16.1 35.9-35.9 35.9z m179.6 0c-19.8 0-35.9-16.1-35.9-35.9s16.1-35.9 35.9-35.9 35.9 16.1 35.9 35.9-16.2 35.9-35.9 35.9z"/>
          </svg>
          <span style={styles.floatText}>交流群</span>
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    position: 'fixed',
    right: '20px',
    bottom: '20px',
    zIndex: 1000,
  },
  floatButton: {
    width: '64px',
    height: '64px',
    borderRadius: '50%',
    backgroundColor: '#07c160',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(7, 193, 96, 0.4)',
    transition: 'all 0.3s ease',
  },
  floatButtonHover: {
    transform: 'scale(1.1)',
    boxShadow: '0 6px 16px rgba(7, 193, 96, 0.5)',
  },
  floatContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '2px',
  },
  floatText: {
    fontSize: '10px',
    fontWeight: 600,
    lineHeight: 1,
  },
  tooltip: {
    position: 'absolute',
    bottom: '70px',
    right: '0',
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '16px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
    width: '280px',
    textAlign: 'center',
  },
  tooltipArrow: {
    position: 'absolute',
    bottom: '-8px',
    right: '20px',
    width: '0',
    height: '0',
    borderLeft: '8px solid transparent',
    borderRight: '8px solid transparent',
    borderTop: '8px solid #fff',
  },
  qrcode: {
    maxWidth: '100%',
    height: 'auto',
    borderRadius: '8px',
    marginBottom: '12px',
  },
  tooltipText: {
    margin: 0,
    fontSize: '14px',
    color: '#333',
    lineHeight: 1.5,
  },
};
