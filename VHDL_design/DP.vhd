library ieee;
use ieee.STD_LOGIC_1164.all;


entity DataPath is 
end DataPath;


architecture DataFlow of DataPath is


	component ALU is 
		generic (au_bw : integer := 16);
		port (
			in_1,in_2 : in std_logic_vector(au_bw - 1 downto 0);
			op : in std_logic_vector(2 downto 0);
			c_in : in std_logic;
			c_prev : in std_logic;
			f : out std_logic_vector(au_bw - 1 downto 0) := (others => '0');
			z,c : out std_logic := '0'
		);
	end component;

	component memory is 
		generic (
			address_length : integer := 12 ;
			data_length : integer := 16
		);
		port (
			address : in std_logic_vector(address_length - 1 downto 0) := (others => '0');
			write_data : in std_logic_vector(data_length - 1 downto 0) := (others => '0');
			clk , mem_r , mem_w: in std_logic := '0';
			data_out : out std_logic_vector(data_length - 1 downto 0) := (others => '0')
		);

	end component;

	component CU is 
		port (
			op : in std_logic_vector(3 downto 0);
			clk : in std_logic;
			pcw,mem_r,mem_w,mem_wd_src,ir,t_w,md_w,a_w,src_a,c_w,z_w,alu_out_w,clean_c,bcc,bne : out std_logic := '0' ;
			pc_src,alu_src,mem_src : out std_logic_vector(1 downto 0) := (others => '0');
			alu_op : out std_logic_vector(3 downto 0) := (others => '0')
		);
	end component;

	component ff is
    		Port (
       			clk : in std_logic := '0';      
        		we  : in std_logic := '0';        
        		input   : in std_logic; 
        		output   : out std_logic
    		);
	end component;

	component Register12 is
    		generic(
			data_length : integer := 12
		);
    		Port (
       			clk : in std_logic := '0';      
        		we  : in std_logic := '0';        
        		input   : in std_logic_vector(data_length - 1 downto 0):= (others => '0'); 
        		output   : out std_logic_vector(data_length - 1 downto 0):= (others => '0')
    		);
	end component;


	component Register16 is
    		generic(
			data_length : integer := 16
		);
    		Port (
       			clk : in std_logic := '0';      
        		we  : in std_logic := '0';        
        		input   : in std_logic_vector(data_length - 1 downto 0):= (others => '0'); 
        		output   : out std_logic_vector(data_length - 1 downto 0):= (others => '0')
    		);
	end component;

	component Mux_2_16bit is 
		generic (au_bw : integer := 16);
		port (
			input_0 ,input_1: in std_logic_vector(au_bw - 1 downto 0);
			sel : in std_logic;
			output : out std_logic_vector(au_bw - 1 downto 0)
		);
	end component;

	component Mux_4_16bit is 
		generic (au_bw : integer := 16);
		port (
			input_0 ,input_1 ,input_2 ,input_3 : in std_logic_vector(au_bw - 1 downto 0);
			sel : in std_logic_vector(1 downto 0);
			output : out std_logic_vector(au_bw - 1 downto 0)
		);
	end component;

	component Mux_2_12bit is 
		generic (au_bw : integer := 12);
		port (
			input_0 ,input_1: in std_logic_vector(au_bw - 1 downto 0);
			sel: in std_logic;
			output : out std_logic_vector(au_bw - 1 downto 0)
		);
	end component;

	component Mux_4_12bit is 
		generic (au_bw : integer := 12);
		port (
			input_0 ,input_1 ,input_2 ,input_3 : in std_logic_vector(au_bw - 1 downto 0);
			sel : in std_logic_vector(1 downto 0);
			output : out std_logic_vector(au_bw - 1 downto 0)
		);
	end component;

	component clock is	
			port (output : out std_logic);
	end component;

	
	signal clk ,pc_w ,a_w ,t_w ,ir_w ,md_w, alu_out_w , mem_wd_src , mem_w , mem_r , src_a , c_w ,z_w , clean_c ,bcc , bne , c_in , z_in , c_out , z_out , pc_level2_mux_sel : std_logic := '0';

	signal pc_in,pc_out , zero_12 , mem_addr ,pc_aux_in_2 : std_logic_vector(11 downto 0) := (others => '0');

	signal a_in,a_out ,t_out ,ir_out ,md_out ,alu_out_in,alu_out_out , zero_16 , mem_data ,mem_out , alu_in_1 , alu_in_2 , mem_in_1_aux_input_1 :std_logic_vector(15 downto 0) := (others => '0');

	signal mem_src,pc_src,alu_src : std_logic_vector(1 downto 0) := (others => '0');
	
	signal alu_op : std_logic_vector(3 downto 0) := (others => '0');

begin

	system_clock : clock port map(output => clk);


	
	A 	: Register16 
			generic map(data_length => 16)
			port map( clk => clk , we => a_w , input => a_in , output => a_out);


	PC	: Register12 
			generic map(data_length => 12)
			port map( clk => clk , we => pc_w , input => pc_in , output => pc_out);

	T 	: Register16 
			generic map(data_length => 16)
			port map( clk => clk , we => t_w , input => a_out , output => t_out);
	IR 	: Register16 
			generic map(data_length => 16)
			port map( clk => clk , we => ir_w , input => mem_out , output => ir_out);
	MD	: Register16 
			generic map(data_length => 16)
			port map( clk => clk , we => md_w , input => mem_out , output => md_out);
	ALU_out : Register16 
			generic map(data_length => 16)
			port map( clk => clk , we => alu_out_w , input => alu_out_in , output => alu_out_out);

	mem_in_addr_mux : Mux_4_12bit 
			generic map(au_bw => 12)
			port map( input_0 => pc_out , input_1 => a_out(11 downto 0) , input_2 => ir_out(11 downto 0) , input_3 => zero_12 , sel => mem_src , output => mem_addr);

	mem_in_wd_mux : Mux_2_16bit 
			generic map(au_bw => 16)
			port map(input_0 => a_out , input_1 => t_out , sel => mem_wd_src , output => mem_data);

	memory_ins : memory 
			generic map ( address_length => 12 , data_length => 16 )
			port map ( address => mem_addr , write_data => mem_data , clk => clk , mem_r => mem_r , mem_w => mem_w , data_out => mem_out);

	cu_ins : CU port map ( op => ir_out(15 downto 12) , clk => clk , pcw => pc_w , mem_r => mem_r , mem_w => mem_w , mem_wd_src => mem_wd_src , ir => ir_w , t_w => t_w , md_w => md_w ,
				 a_w => a_w , src_a => src_a, c_w => c_w , z_w => z_w , alu_out_w => alu_out_w , clean_c => clean_c , bcc => bcc , bne => bne , pc_src => pc_src , alu_src => alu_src ,
				mem_src => mem_src , alu_op => alu_op
	);

	a_in_aux : Mux_2_16bit port map(input_0 => md_out , input_1 => alu_out_in , sel => src_a , output => a_in);

	mem_in_1_aux_input_1 <= "0000"&pc_out;
	mem_in_1_aux : Mux_2_16bit 
			generic map(au_bw => 16)
			port map(input_0 => a_out , input_1 => mem_in_1_aux_input_1 , sel => alu_src(0) , output => alu_in_1);
	mem_in_2_aux : Mux_2_16bit 
			generic map(au_bw => 16)
			port map(input_0 => md_out , input_1 => "0000000000000001" , sel => alu_src(1) , output => alu_in_2);

	alu_ins : ALU port map(in_1 => alu_in_1 , in_2 => alu_in_2, op => alu_op(2 downto 0) , c_in => alu_op(3) , f => alu_out_in , c => c_in , z => z_in , c_prev => c_out);

	c : ff port map (clk => clk , we => c_w , input => c_in , output => c_out);
	z : ff port map (clk => clk , we => z_w , input => z_in , output => z_out);

	pc_level2_mux_sel <= (bne and (c_out and '1')) or (bcc and (z_out xor '0'));
	
	pc_level_2_aux : Mux_2_12bit
			generic map(au_bw => 12)
			port map(input_0 => alu_out_out(11 downto 0) , input_1 => md_out(11 downto 0) , sel => pc_level2_mux_sel , output => pc_aux_in_2);

	pc_mux : Mux_4_12bit 
			generic map(au_bw => 12)
			port map( input_0 =>  alu_out_out(11 downto 0) , input_1 =>  ir_out(11 downto 0) , input_2 => pc_aux_in_2 , input_3 => zero_12 , sel => pc_src , output => pc_in);


	
end DataFlow;
